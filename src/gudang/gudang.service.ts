import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { CreateGudangDto, UpdateGudangDto } from './gudang.dto';

@Injectable()
export class GudangService {
  constructor(private prisma: PrismaService) {}

  async getGudang() {
    const gudang = await this.prisma.gudang.findMany({
      include: {
        _count: {
          select: {
            produk: true,
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
          can_delete: _count.produk == 0,
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
}
