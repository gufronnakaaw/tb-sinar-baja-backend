import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { CreateKategoriType, CreateSubKategoriType } from './kategori.dto';

@Injectable()
export class KategoriService {
  constructor(private prisma: PrismaService) {}

  getKategori() {
    return this.prisma.kategori.findMany({
      select: {
        id_kategori: true,
        nama: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async getSubKategori() {
    const result = await this.prisma.subKategori.findMany({
      select: {
        id_subkategori: true,
        nama: true,
        kategori: {
          select: {
            nama: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
    });

    return result.map((item) => {
      const { kategori, ...results } = item;
      delete item.kategori;

      return {
        ...results,
        kategori: kategori.nama,
      };
    });
  }

  async createKategori(body: CreateKategoriType) {
    const check = await this.prisma.kategori.findMany({
      orderBy: {
        id_kategori: 'desc',
      },
    });

    if (
      check.find((item) => item.nama.toLowerCase() == body.nama.toLowerCase())
    ) {
      throw new BadRequestException('Kategori sudah ada');
    }

    return this.prisma.kategori.create({
      data: {
        id_kategori: check[0].id_kategori + 1,
        nama: body.nama,
      },
      select: {
        id_kategori: true,
        nama: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async createSubKategori(body: CreateSubKategoriType) {
    const check = await this.prisma.kategori.findUnique({
      where: {
        id_kategori: body.id_kategori,
      },
    });

    if (!check) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }

    const lastSubKategori = await this.prisma.subKategori.findMany({
      where: {
        kategori_id: body.id_kategori,
      },
      orderBy: {
        id_subkategori: 'desc',
      },
    });

    if (lastSubKategori.length == 0) {
      return this.prisma.subKategori.create({
        data: {
          id_subkategori: parseInt(`${body.id_kategori}1`),
          nama: body.nama,
          kategori_id: body.id_kategori,
        },
      });
    }

    if (
      lastSubKategori.find(
        (item) => item.nama.toLowerCase() == body.nama.toLowerCase(),
      )
    ) {
      throw new BadRequestException('Sub kategori sudah ada');
    }

    return this.prisma.subKategori.create({
      data: {
        id_subkategori: lastSubKategori[0].id_subkategori + 1,
        nama: body.nama,
        kategori_id: body.id_kategori,
      },
      select: {
        id_subkategori: true,
        nama: true,
        created_at: true,
        updated_at: true,
      },
    });
  }
}
