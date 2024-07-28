import { BadRequestException, Injectable } from '@nestjs/common';
import { generateID } from 'src/utils/generate.util';
import { PrismaService } from '../utils/services/prisma.service';
import {
  CreateEntryDto,
  CreateGudangDto,
  UpdateGudangDto,
  UpdateStokGudangDto,
} from './gudang.dto';

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
    const results = [];

    const produk = await this.prisma.entry.findMany({
      where: {
        status: 'show',
      },
      select: {
        id_table: true,
        kode_item: true,
        nama_produk: true,
        jumlah: true,
        created_at: true,
      },
    });

    for (const [index, item] of produk.entries()) {
      const { kode_item } = item;

      const stok = await this.prisma.stock.findMany({
        where: {
          produk_id: kode_item,
        },
        select: {
          gudang: {
            select: {
              nama: true,
            },
          },
        },
      });

      results.push({
        ...produk[index],
        gudang: stok.map((el) => el.gudang.nama),
      });
    }

    return results;
  }

  async createEntry({
    produk_baik,
    produk_rusak,
    preorder_id,
  }: CreateEntryDto) {
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
          preorder_id,
        };
      }),
    });
  }

  async updateStokGudang({ list_produk }: UpdateStokGudangDto) {
    for (const produk of list_produk) {
      const gudang = produk.gudang_id.split(',');
      const stok = produk.jumlah_entry.split(',');

      for (const [index, item] of gudang.entries()) {
        await this.prisma.stock.updateMany({
          where: {
            produk_id: produk.kode_item,
            gudang: {
              kode_gudang: item.toUpperCase().trim(),
            },
          },
          data: {
            stok: {
              increment: parseFloat(stok[index]),
            },
          },
        });

        await this.prisma.entry.update({
          where: {
            id_table: produk.id_table,
          },
          data: {
            status: 'hide',
          },
        });
      }
    }

    return {
      total: list_produk.length,
    };
  }
}
