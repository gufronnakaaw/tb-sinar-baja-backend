import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { SuratJalanQuery, UpdateSuratJalanDto } from './suratjalan.dto';

@Injectable()
export class SuratjalanService {
  constructor(private prisma: PrismaService) {}

  getSuratJalan(query: SuratJalanQuery) {
    if (query.id) {
      return this.prisma.suratJalan.findFirst({
        where: {
          id_suratjalan: query.id,
        },
        select: {
          id_suratjalan: true,
          nama_driver: true,
          kendaraan: true,
          plat_kendaraan: true,
          verifikasi: true,
          transaksi: {
            select: {
              id_transaksi: true,
              created_at: true,
              penerima: true,
              transaksidetail: {
                select: {
                  jumlah: true,
                  satuan: true,
                  nama_produk: true,
                  gudang: true,
                  rak: true,
                },
              },
            },
          },
        },
      });
    }

    return this.prisma.suratJalan.findMany({
      select: {
        id_suratjalan: true,
        transaksi_id: true,
        nama_driver: true,
        kendaraan: true,
        plat_kendaraan: true,
        verifikasi: true,
        transaksi: {
          select: {
            penerima: true,
            created_at: true,
          },
        },
      },
      orderBy: {
        transaksi: {
          created_at: 'desc',
        },
      },
    });
  }

  async updateSuratJalan(body: UpdateSuratJalanDto) {
    const check = await this.prisma.suratJalan.count({
      where: {
        id_suratjalan: body.id_suratjalan,
      },
    });

    if (!check) {
      throw new NotFoundException('Surat jalan tidak ditemukan');
    }

    return this.prisma.suratJalan.update({
      where: {
        id_suratjalan: body.id_suratjalan,
      },
      data: {
        nama_driver: body.nama_driver,
        kendaraan: body.kendaraan,
        plat_kendaraan: body.plat_kendaraan,
        verifikasi: body.verifikasi,
      },
      select: {
        id_suratjalan: true,
        transaksi_id: true,
        nama_driver: true,
        kendaraan: true,
        plat_kendaraan: true,
        verifikasi: true,
      },
    });
  }
}
