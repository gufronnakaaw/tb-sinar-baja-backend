import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { CreatePriceQuantityDto, UpdatePriceQuantityDto } from './setting.dto';

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService) {}

  getSetting() {
    return this.prisma.setting.findUnique({
      where: {
        id_table: 1,
      },
      select: {
        field: true,
      },
    });
  }

  updateSetting(field: string) {
    return this.prisma.setting.update({
      where: {
        id_table: 1,
      },
      data: {
        field,
      },
      select: {
        field: true,
      },
    });
  }

  async getHargaQuantity() {
    const harga = await this.prisma.hargaQuantity.findMany({
      include: {
        produk: {
          select: {
            satuan_kecil: true,
            nama_produk: true,
            nama_produk_asli: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return harga.map((item) => {
      const { produk } = item;
      delete item.produk;

      return {
        ...item,
        ...produk,
      };
    });
  }

  createPriceQuantity(body: CreatePriceQuantityDto) {
    return this.prisma.hargaQuantity.create({
      data: {
        produk_id: body.produk_id,
        harga: body.harga,
        quantity: body.quantity,
        keterangan: body.keterangan,
      },
    });
  }

  updatePriceQuantity(body: UpdatePriceQuantityDto) {
    return this.prisma.hargaQuantity.update({
      where: {
        id_table: body.id_table,
      },
      data: {
        harga: body.harga,
        quantity: body.quantity,
        keterangan: body.keterangan,
      },
    });
  }

  async destroyPriceQuantity(id_table: number) {
    if (!(await this.prisma.hargaQuantity.count({ where: { id_table } }))) {
      throw new NotFoundException('Harga tidak ditemukan');
    }

    return this.prisma.hargaQuantity.delete({
      where: { id_table },
    });
  }
}
