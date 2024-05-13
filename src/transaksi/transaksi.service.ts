import { Injectable, NotFoundException } from '@nestjs/common';
import { generateID } from 'src/utils/generate.util';
import { PrismaService } from '../utils/services/prisma.service';
import { CreateTransaksiDto } from './transaksi.dto';

@Injectable()
export class TransaksiService {
  constructor(private prisma: PrismaService) {}

  async getTransaksi() {
    const results = await this.prisma.transaksi.findMany({
      include: {
        transaksidetail: {
          select: {
            kode_item: true,
            jumlah: true,
            satuan: true,
            nama_produk: true,
            harga: true,
            sub_total: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return results.map((transaksi) => {
      delete transaksi.id_table;

      const { transaksidetail, ...result } = transaksi;
      delete transaksi.transaksidetail;

      return {
        ...result,
        list_produk: transaksidetail,
      };
    });
  }

  async getTransaksiById(id: string) {
    const result = await this.prisma.transaksi.findFirst({
      where: {
        id_transaksi: id,
      },
      include: {
        transaksidetail: {
          select: {
            kode_item: true,
            jumlah: true,
            satuan: true,
            nama_produk: true,
            harga: true,
            sub_total: true,
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    delete result.id_table;

    const { transaksidetail, ...results } = result;
    delete result.transaksidetail;

    return {
      ...results,
      list_produk: transaksidetail,
    };
  }

  async createTransaksi(body: CreateTransaksiDto) {
    const check = await this.prisma.transaksi.findMany({
      where: {
        unique_key: body.unique_key,
      },
      include: {
        transaksidetail: {
          select: {
            kode_item: true,
            jumlah: true,
            satuan: true,
            nama_produk: true,
            harga: true,
            sub_total: true,
          },
        },
      },
    });

    if (check.length > 0) {
      delete check[0].id_table;

      const { transaksidetail, ...results } = check[0];
      delete check[0].transaksidetail;

      const result = {
        ...results,
        list_produk: transaksidetail,
      };

      return result;
    }

    for (const produk of body.list_produk) {
      await this.prisma.produk.update({
        where: {
          kode_item: produk.kode_item,
        },
        data: {
          stok: {
            decrement: produk.jumlah,
          },
        },
      });
    }

    const date = new Date();
    const [result] = await this.prisma.$transaction([
      this.prisma.transaksi.create({
        data: {
          id_transaksi: generateID('TX', date),
          keterangan: body.keterangan,
          penerima: body.penerima,
          no_telp: body.no_telp,
          pengiriman: body.pengiriman,
          alamat: body.alamat,
          ongkir: body.ongkir,
          pajak: body.pajak,
          persen_pajak: body.persen_pajak,
          total_belanja: body.total_belanja,
          total_pembayaran: body.total_pembayaran,
          tunai: body.tunai,
          tipe: body.tipe,
          unique_key: body.unique_key,
          metode: body.metode,
          transaksidetail: {
            createMany: {
              data: body.list_produk.map((produk) => {
                return {
                  jumlah: produk.jumlah,
                  satuan: produk.satuan,
                  nama_produk: produk.nama_produk,
                  kode_item: produk.kode_item,
                  harga: produk.harga,
                  sub_total: produk.sub_total,
                };
              }),
            },
          },
          created_at: date,
          updated_at: date,
        },
        include: {
          transaksidetail: {
            select: {
              kode_item: true,
              jumlah: true,
              satuan: true,
              nama_produk: true,
              harga: true,
              sub_total: true,
            },
          },
        },
      }),
    ]);

    delete result.id_table;

    const { transaksidetail, ...results } = result;
    delete result.transaksidetail;

    return {
      ...results,
      list_produk: transaksidetail,
    };
  }
}
