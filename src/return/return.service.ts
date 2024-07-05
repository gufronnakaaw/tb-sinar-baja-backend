import { Injectable, NotFoundException } from '@nestjs/common';
import { generateID } from '../utils/generate.util';
import { PrismaService } from '../utils/services/prisma.service';
import { CreateReturnDto } from './return.dto';

@Injectable()
export class ReturnService {
  constructor(private prisma: PrismaService) {}

  async createReturn(body: CreateReturnDto) {
    if (
      !(await this.prisma.transaksi.count({
        where: { id_transaksi: body.transaksi_id },
      }))
    ) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    const date = new Date();

    for (const produk of body.list_produk) {
      await this.prisma.stock.updateMany({
        where: {
          produk_id: produk.kode_item,
          gudang: {
            nama: produk.gudang,
          },
        },
        data: {
          stok: {
            increment: produk.dikembalikan,
          },
        },
      });
    }

    return this.prisma.return.create({
      data: {
        id_return: generateID('RET', date),
        transaksi_id: body.transaksi_id,
        metode: body.metode,
        id_transaksi_bank: body.id_transaksi_bank,
        nama_bank: body.nama_bank,
        atas_nama: body.atas_nama,
        no_rekening: body.no_rekening,
        jumlah: body.jumlah,
        penalti_keseluruhan: body.penalti_keseluruhan,
        created_at: date,
        updated_at: date,
        returndetail: {
          createMany: {
            data: body.list_produk.map((item) => {
              return {
                nama_produk: item.nama_produk,
                kode_item: item.kode_item,
                harga: item.harga,
                harga_setelah_diskon: item.harga_setelah_diskon,
                diskon_langsung_item: item.diskon_langsung_item,
                diskon_persen_item: item.diskon_persen_item,
                penalti_item: item.penalti,
                jumlah: item.dikembalikan,
                gudang: item.gudang,
                rak: item.rak,
                satuan: item.satuan,
                sub_total: item.sub_total,
                total_pengembalian: item.total_pengembalian,
                diskon_per_item: item.diskon_per_item,
              };
            }),
          },
        },
      },
    });
  }

  async getReturn() {
    const result = await this.prisma.return.findMany({
      orderBy: {
        created_at: 'desc',
      },
      include: {
        transaksi: {
          select: {
            penerima: true,
          },
        },
        returndetail: {
          select: {
            nama_produk: true,
          },
        },
      },
    });

    return result.map((item) => {
      const { transaksi, returndetail } = item;
      delete item.id_table;
      delete item.transaksi;
      delete item.returndetail;

      return {
        ...item,
        penerima: transaksi.penerima,
        total_item: returndetail.length,
      };
    });
  }

  async getReturnById(id_return: string) {
    const result = await this.prisma.return.findUnique({
      where: {
        id_return,
      },
      include: {
        transaksi: true,
        returndetail: true,
      },
    });

    delete result.id_table;
    delete result.transaksi.id_table;

    return {
      ...result,
      returndetail: result.returndetail.map((item) => {
        delete item.id_table;
        delete item.return_id;

        return {
          ...item,
        };
      }),
    };
  }
}
