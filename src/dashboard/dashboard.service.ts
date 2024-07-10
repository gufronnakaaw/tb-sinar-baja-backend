import { Injectable } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import {
  AdminDashboardDto,
  CashierDashboardDto,
  OwnerDashboardDto,
} from './dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData(role: 'owner' | 'admin' | 'cashier') {
    if (!role || role == 'owner') {
      return this.getOwnerDashboard();
    }

    if (role == 'admin') {
      return this.getAdminDashboard();
    }

    if (role == 'cashier') {
      return this.getCashierDashboard();
    }
  }

  async getOwnerDashboard(): Promise<OwnerDashboardDto> {
    const omzet = await this.getOmzet();
    const hutang = await this.getHutang();
    const piutang = await this.getPiutang();
    const rusak = await this.getBarangRusak();
    const estimasi = await this.getEstimasiRugi();

    return {
      status_stok: 'aman',
      omzet: omzet ?? 0,
      laba_kotor: 0,
      barang_rusak: rusak ?? 0,
      hutang: hutang ?? 0,
      estimasi_rugi: estimasi ?? 0,
      piutang: piutang ?? 0,
    };
  }

  async getAdminDashboard(): Promise<AdminDashboardDto> {
    const omzet = await this.getOmzet();
    const hutang = await this.getHutang();
    const piutang = await this.getPiutang();
    const rusak = await this.getBarangRusak();

    return {
      status_stok: 'aman',
      omzet: omzet ?? 0,
      barang_rusak: rusak ?? 0,
      hutang: hutang ?? 0,
      piutang: piutang ?? 0,
    };
  }

  async getCashierDashboard(): Promise<CashierDashboardDto> {
    const omzet = await this.getOmzet();
    const rusak = await this.getBarangRusak();

    return {
      status_stok: 'aman',
      omzet: omzet ?? 0,
      barang_rusak: rusak ?? 0,
    };
  }

  async getOmzet() {
    const omzet = await this.prisma.transaksi.aggregate({
      _sum: {
        total_pembayaran: true,
      },
    });

    return omzet._sum.total_pembayaran;
  }

  async getHutang() {
    const hutang = await this.prisma.invoice.aggregate({
      _sum: {
        sisa: true,
      },
    });

    return hutang._sum.sisa;
  }

  async getPiutang() {
    const piutang = await this.prisma.invoiceKeluar.aggregate({
      _sum: {
        sisa: true,
      },
    });

    return piutang._sum.sisa;
  }

  async getBarangRusak() {
    const rusak = await this.prisma.beritaAcaraDetail.aggregate({
      _sum: {
        jumlah: true,
      },
    });

    return rusak._sum.jumlah;
  }

  async getEstimasiRugi() {
    const estimasi = await this.prisma.beritaAcaraDetail.aggregate({
      _sum: {
        total: true,
      },
    });

    return estimasi._sum.total;
  }
}
