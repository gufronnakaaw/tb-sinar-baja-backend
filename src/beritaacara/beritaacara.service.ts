import { Injectable } from '@nestjs/common';
import { generateID } from '../utils/generate.util';
import { PrismaService } from '../utils/services/prisma.service';
import { CreateBeritaAcaraDto } from './beritaacara.dto';

@Injectable()
export class BeritaacaraService {
  constructor(private prisma: PrismaService) {}

  async getBeritaAcara() {
    const ba = await this.prisma.beritaAcara.findMany({
      select: {
        id_ba: true,
        created_at: true,
        updated_at: true,
        beritaacaradetail: {
          select: {
            jumlah: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return ba.map(({ id_ba, created_at, updated_at, beritaacaradetail }) => {
      return {
        id_ba,
        jumlah_barang: beritaacaradetail.reduce((a, b) => a + b.jumlah, 0),
        created_at,
        updated_at,
      };
    });
  }

  async getBeritaAcaraById(id_ba: string) {
    const {
      id_ba: id_beritaacara,
      created_at,
      updated_at,
      beritaacaradetail,
    } = await this.prisma.beritaAcara.findUnique({
      where: {
        id_ba,
      },
      select: {
        id_ba: true,
        created_at: true,
        updated_at: true,
        beritaacaradetail: {
          select: {
            kode_item: true,
            nama_produk: true,
            harga: true,
            satuan: true,
            jumlah: true,
            gudang: true,
            rak: true,
            alasan: true,
            tipe_harga: true,
            total: true,
          },
        },
      },
    });

    return {
      id_ba: id_beritaacara,
      created_at,
      updated_at,
      list_produk: beritaacaradetail,
    };
  }

  async createBeritaAcara(body: CreateBeritaAcaraDto) {
    for (const item of body.list_produk) {
      await this.prisma.stock.updateMany({
        where: {
          produk_id: item.kode_item,
          gudang: {
            nama: item.gudang,
          },
        },
        data: {
          stok: {
            decrement: item.jumlah,
          },
        },
      });
    }

    const date = new Date();
    const data = [];

    for (const item of body.list_produk) {
      const stock = await this.prisma.stock.findMany({
        select: {
          rak: true,
        },
        where: {
          produk_id: item.kode_item,
          gudang: {
            nama: item.gudang,
          },
        },
      });

      data.push({
        kode_item: item.kode_item,
        nama_produk: item.nama_produk,
        jumlah: item.jumlah,
        satuan: item.satuan,
        harga: item.harga,
        tipe_harga: item.tipe_harga,
        gudang: item.gudang,
        alasan: item.alasan,
        rak: stock[0].rak,
        total: item.jumlah * item.harga,
      });
    }

    return this.prisma.beritaAcara.create({
      data: {
        id_ba: generateID('BA', date),
        created_at: date,
        updated_at: date,
        beritaacaradetail: {
          createMany: {
            data,
          },
        },
      },
    });
  }
}
