import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import {
  CreateBulkSubkategoriType,
  CreateKategoriType,
  CreateSubKategoriType,
  KategoriQuery,
  UpdateKategoriType,
  UpdateSubKategoriType,
} from './kategori.dto';

@Injectable()
export class KategoriService {
  constructor(private prisma: PrismaService) {}

  async getKategori(query: KategoriQuery) {
    const defaultPage = 1;
    const defaultSize = 10;

    const page = parseInt(query.page) ? parseInt(query.page) : defaultPage;
    const size = parseInt(query.size) ? parseInt(query.size) : defaultSize;

    const skip = (page - 1) * size;

    if (query.id) {
      const kategori = await this.prisma.kategori.findFirst({
        where: {
          id_kategori: parseInt(query.id),
        },
        select: {
          id_kategori: true,
          nama: true,
          subkategori: {
            select: {
              id_subkategori: true,
              nama: true,
              created_at: true,
              updated_at: true,
            },
            orderBy: {
              created_at: 'desc',
            },
          },
        },
      });

      return {
        ...kategori,
      };
    }

    const [total, kategori] = await this.prisma.$transaction([
      this.prisma.kategori.count(),
      this.prisma.kategori.findMany({
        select: {
          id_kategori: true,
          nama: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
    ]);

    // {
    //   kategori,
    //   page,
    //   total_items: total,
    //   total_page: Math.ceil(total / size),
    // };

    return kategori;
  }

  async createKategori(body: CreateKategoriType) {
    const kategori = await this.prisma.kategori.findMany({
      orderBy: {
        id_kategori: 'desc',
      },
    });

    if (
      kategori.find(
        (item) => item.nama.toLowerCase() == body.nama.toLowerCase(),
      )
    ) {
      throw new BadRequestException('Kategori sudah ada');
    }

    const id_kategori = kategori.length == 0 ? 1 : kategori[0].id_kategori + 1;

    return this.prisma.kategori.create({
      data: {
        id_kategori,
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
    const kategori = await this.prisma.kategori.findUnique({
      where: {
        id_kategori: body.id_kategori,
      },
    });

    if (!kategori) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }

    const lastSubKategori = await this.prisma.subKategori.findMany({
      where: {
        kategori_id: body.id_kategori,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (lastSubKategori.length == 0) {
      return this.prisma.subKategori.create({
        data: {
          id_subkategori: `${body.id_kategori}-1`,
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

    if (
      lastSubKategori.find(
        (item) => item.nama.toLowerCase() == body.nama.toLowerCase(),
      )
    ) {
      throw new BadRequestException('Sub kategori sudah ada');
    }

    const splitId = lastSubKategori[0].id_subkategori.split('-')[1];

    return this.prisma.subKategori.create({
      data: {
        id_subkategori: `${body.id_kategori}-${parseInt(splitId) + 1}`,
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

  async updateKategori(body: UpdateKategoriType) {
    const kategori = await this.prisma.kategori.findUnique({
      where: {
        id_kategori: body.id_kategori,
      },
    });

    if (!kategori) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }

    return this.prisma.kategori.update({
      where: {
        id_kategori: body.id_kategori,
      },
      data: {
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

  async updateSubKategori(body: UpdateSubKategoriType) {
    const subkategori = await this.prisma.subKategori.findUnique({
      where: {
        id_subkategori: body.id_subkategori,
      },
    });

    if (!subkategori) {
      throw new NotFoundException('Sub Kategori tidak ditemukan');
    }

    return this.prisma.subKategori.update({
      where: {
        id_subkategori: body.id_subkategori,
      },
      data: {
        nama: body.nama,
      },
      select: {
        id_subkategori: true,
        nama: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async createBulkSubkategori(body: CreateBulkSubkategoriType) {
    const kategori = await this.prisma.kategori.findUnique({
      where: {
        id_kategori: body.id_kategori,
      },
    });

    if (!kategori) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }

    for (const subkategori of body.subkategori) {
      const create = {};

      const lastSubKategori = await this.prisma.subKategori.findMany({
        where: {
          kategori_id: body.id_kategori,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      if (lastSubKategori.length == 0) {
        Object.assign(create, {
          id_subkategori: `${body.id_kategori}-1`,
          nama: subkategori.nama,
          kategori_id: body.id_kategori,
        });
      }

      if (
        lastSubKategori.find(
          (item) => item.nama.toLowerCase() == subkategori.nama.toLowerCase(),
        )
      ) {
        throw new BadRequestException('Sub kategori sudah ada');
      }

      if (lastSubKategori.length > 0) {
        const splitId = lastSubKategori[0].id_subkategori.split('-')[1];

        Object.assign(create, {
          id_subkategori: `${body.id_kategori}-${parseInt(splitId) + 1}`,
          nama: subkategori.nama,
          kategori_id: body.id_kategori,
        });
      }

      await this.prisma.subKategori.create({
        data: create,
      });
    }
  }
}
