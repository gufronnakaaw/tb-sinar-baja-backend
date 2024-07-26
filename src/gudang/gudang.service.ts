import { BadRequestException, Injectable } from '@nestjs/common';
import { generateID } from 'src/utils/generate.util';
import { PrismaService } from '../utils/services/prisma.service';
import { CreateEntryDto, CreateGudangDto, UpdateGudangDto } from './gudang.dto';

@Injectable()
export class GudangService {
  constructor(private prisma: PrismaService) {}

  async getGudang() {
    const gudang = await this.prisma.gudang.findMany({
      include: {
        _count: {
          select: {
            stock: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return gudang.map(
      ({ kode_gudang, nama, created_at, updated_at, _count }) => {
        return {
          kode_gudang,
          nama,
          created_at,
          updated_at,
          can_delete: _count.stock == 0,
        };
      },
    );
  }

  async createGudang(body: CreateGudangDto) {
    const check = await this.prisma.gudang.count({
      where: {
        kode_gudang: body.kode_gudang,
      },
    });

    if (check) {
      throw new BadRequestException('Gudang sudah ada');
    }

    return this.prisma.gudang.create({
      data: {
        kode_gudang: body.kode_gudang,
        nama: body.nama,
      },
      select: {
        kode_gudang: true,
        nama: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async updateGudang(body: UpdateGudangDto) {
    const check = await this.prisma.gudang.count({
      where: {
        kode_gudang: body.kode_gudang,
      },
    });

    if (!check) {
      throw new BadRequestException('Gudang tidak ada');
    }

    return this.prisma.gudang.update({
      where: {
        kode_gudang: body.kode_gudang,
      },
      data: {
        nama: body.nama,
      },
      select: {
        kode_gudang: true,
        nama: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async deleteGudang(kode_gudang: string) {
    const check = await this.prisma.gudang.count({
      where: {
        kode_gudang,
      },
    });

    if (!check) {
      throw new BadRequestException('Gudang tidak ada');
    }

    return this.prisma.gudang.delete({
      where: {
        kode_gudang,
      },
      select: {
        kode_gudang: true,
        nama: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async getEntry() {
    return this.prisma.entry.findMany({
      select: {
        kode_item: true,
        nama_produk: true,
        jumlah: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async createEntry({ produk_baik, produk_rusak }: CreateEntryDto) {
    const date = new Date();

    if (produk_rusak.length) {
      await this.prisma.beritaAcara.create({
        data: {
          id_ba: generateID('BA', date),
          created_at: date,
          updated_at: date,
          type: 'external',
          beritaacaradetail: {
            createMany: {
              data: produk_rusak.map((item) => {
                return {
                  kode_item: item.kode_item,
                  nama_produk: item.nama_produk,
                  jumlah: item.jumlah_rusak,
                  satuan: item.satuan_rusak,
                  alasan: 'string',
                  gudang: 'string',
                  harga: 0,
                  tipe_harga: 'string',
                  total: 0,
                  rak: 'string',
                };
              }),
            },
          },
        },
      });
    }

    return this.prisma.entry.createMany({
      data: produk_baik.map((item) => {
        return {
          kode_item: item.kode_item,
          nama_produk: item.nama_produk,
          jumlah: item.jumlah_entry,
        };
      }),
    });
  }
}
