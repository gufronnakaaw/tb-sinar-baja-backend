import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { CreateMemberDto } from './member.dto';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  getMember() {
    return this.prisma.member.findMany({
      select: {
        id_member: true,
        nama: true,
        perusahaan: true,
        alamat: true,
        email: true,
        no_telp: true,
        created_at: true,
        updated_at: true,
        level: {
          select: {
            nama: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async createMember(body: CreateMemberDto) {
    const member = await this.prisma.member.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    if (member.length == 0) {
      return this.prisma.member.create({
        data: {
          id_member: 'MEM-1',
          level_id: body.level_id,
          nama: body.nama,
          perusahaan: body.perusahaan,
          alamat: body.alamat,
          email: body.email,
          no_telp: body.no_telp,
        },
        select: {
          id_member: true,
          nama: true,
          perusahaan: true,
          alamat: true,
          email: true,
          no_telp: true,
          created_at: true,
          updated_at: true,
          level: {
            select: {
              nama: true,
            },
          },
        },
      });
    }

    if (
      member.find((item) => item.nama.toLowerCase() == body.nama.toLowerCase())
    ) {
      throw new BadRequestException('member sudah ada');
    }

    const splitId = member[0].id_member.split('-')[1];

    return this.prisma.member.create({
      data: {
        id_member: `MEM-${parseInt(splitId) + 1}`,
        level_id: body.level_id,
        nama: body.nama,
        perusahaan: body.perusahaan,
        alamat: body.alamat,
        email: body.email,
        no_telp: body.no_telp,
      },
      select: {
        id_member: true,
        nama: true,
        perusahaan: true,
        alamat: true,
        email: true,
        no_telp: true,
        created_at: true,
        updated_at: true,
        level: {
          select: {
            nama: true,
          },
        },
      },
    });
  }
}