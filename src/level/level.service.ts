import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { CreateLevelDto, UpdateLevelDto } from './level.dto';

@Injectable()
export class LevelService {
  constructor(private prisma: PrismaService) {}

  getLevel() {
    return this.prisma.level.findMany({
      select: {
        id_level: true,
        nama: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async createLevel(body: CreateLevelDto) {
    const level = await this.prisma.level.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    if (level.length == 0) {
      return this.prisma.level.create({
        data: {
          id_level: 'LEV-1',
          nama: body.nama,
        },
        select: {
          id_level: true,
          nama: true,
          created_at: true,
          updated_at: true,
        },
      });
    }

    if (
      level.find((item) => item.nama.toLowerCase() == body.nama.toLowerCase())
    ) {
      throw new BadRequestException('Level sudah ada');
    }

    const splitId = level[0].id_level.split('-')[1];

    return this.prisma.level.create({
      data: {
        id_level: `LEV-${parseInt(splitId) + 1}`,
        nama: body.nama,
      },
      select: {
        id_level: true,
        nama: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async updateLevel(body: UpdateLevelDto) {
    const level = await this.prisma.level.count({
      where: {
        id_level: body.id_level,
      },
    });

    if (!level) {
      throw new NotFoundException('Level tidak ada');
    }

    return this.prisma.level.update({
      where: {
        id_level: body.id_level,
      },
      data: {
        nama: body.nama,
      },
      select: {
        id_level: true,
        nama: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async deleteLevel(id_level: string) {
    const level = await this.prisma.level.count({
      where: {
        id_level,
      },
    });

    if (!level) {
      throw new NotFoundException('Level tidak ada');
    }

    return this.prisma.level.delete({
      where: {
        id_level,
      },
      select: {
        id_level: true,
        nama: true,
        created_at: true,
        updated_at: true,
      },
    });
  }
}
