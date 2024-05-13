import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { CreateGudangDto } from './gudang.dto';

@Injectable()
export class GudangService {
  constructor(private prisma: PrismaService) {}

  getGudang() {
    return this.prisma.gudang.findMany({
      select: {
        kode_gudang: true,
        nama: true,
        created_at: true,
        updated_at: true,
      },
    });
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
}
