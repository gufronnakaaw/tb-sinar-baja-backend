import { BadRequestException, Injectable } from '@nestjs/common';
import { hashPassword, verifyPassword } from '../utils/bcrypt.util';
import { decryptPassword, encryptPassword } from '../utils/crypto.util';
import { PrismaService } from '../utils/services/prisma.service';
import {
  CreatePenggunaDto,
  LoginPenggunaDto,
  PenggunaQuery,
  UpdatePenggunaDto,
} from './pengguna.dto';

@Injectable()
export class PenggunaService {
  constructor(private prisma: PrismaService) {}

  getPengguna() {
    return this.prisma.pengguna.findMany({
      where: {
        NOT: {
          role: 'superuser',
        },
      },
      select: {
        username: true,
        nama: true,
        password_hash: true,
        password_encrypt: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async createPengguna(body: CreatePenggunaDto) {
    const pengguna = await this.prisma.pengguna.count({
      where: {
        username: body.username,
      },
    });

    if (pengguna) {
      throw new BadRequestException('Pengguna sudah ada');
    }

    return this.prisma.pengguna.create({
      data: {
        nama: body.nama,
        username: body.username,
        password_encrypt: encryptPassword(
          body.password,
          process.env.ENCRYPT_KEY,
        ),
        password_hash: await hashPassword(body.password),
        role: body.role,
      },
      select: {
        username: true,
        nama: true,
        password_hash: true,
        password_encrypt: true,
        role: true,
        created_at: true,
      },
    });
  }

  async seePassword(query: PenggunaQuery) {
    const pengguna = await this.prisma.pengguna.count({
      where: {
        username: query.username,
      },
    });

    if (!pengguna) {
      throw new BadRequestException('Pengguna tidak ada');
    }

    return decryptPassword(query.password_encrypt, process.env.ENCRYPT_KEY);
  }

  async updatePengguna(body: UpdatePenggunaDto) {
    const pengguna = await this.prisma.pengguna.findFirst({
      where: {
        username: body.username,
      },
    });

    if (!pengguna) {
      throw new BadRequestException('Pengguna tidak ada');
    }

    const data = {
      nama: body.nama,
      role: body.role,
    };

    if (body.password_old) {
      const decrypt = decryptPassword(
        pengguna.password_encrypt,
        process.env.ENCRYPT_KEY,
      );

      if (body.password_old != decrypt) {
        throw new BadRequestException('Password lama anda salah');
      }

      Object.assign(data, {
        password_encrypt: encryptPassword(
          body.password_new,
          process.env.ENCRYPT_KEY,
        ),
        password_hash: await hashPassword(body.password_new),
      });
    }

    return this.prisma.pengguna.update({
      where: {
        username: body.username,
      },
      data,
      select: {
        username: true,
        nama: true,
        password_hash: true,
        password_encrypt: true,
        role: true,
        created_at: true,
      },
    });
  }

  async deletePengguna(username: string) {
    const pengguna = await this.prisma.pengguna.count({
      where: {
        username,
      },
    });

    if (!pengguna) {
      throw new BadRequestException('Pengguna tidak ada');
    }

    return this.prisma.pengguna.delete({
      where: {
        username,
      },
      select: {
        username: true,
        nama: true,
        password_hash: true,
        password_encrypt: true,
        role: true,
        created_at: true,
      },
    });
  }

  async loginPengguna({ username, password }: LoginPenggunaDto) {
    const pengguna = await this.prisma.pengguna.findUnique({
      where: {
        username,
      },
    });

    if (!pengguna) {
      throw new BadRequestException('Username atau password salah');
    }

    if (!(await verifyPassword(password, pengguna.password_hash))) {
      throw new BadRequestException('Username atau password salah');
    }

    return {
      nama: pengguna.nama,
      role: pengguna.role.split(','),
    };
  }
}
