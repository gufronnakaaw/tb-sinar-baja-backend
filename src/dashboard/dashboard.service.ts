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
    return {
      status_stok: 'aman',
      omzet: !omzet ? 0 : omzet,
      laba_kotor: 0,
      barang_rusak: 0,
      pembayaran_lunas: 0,
      estimasi_rugi: 0,
      konsinyasi: 0,
    };
  }

  async getAdminDashboard(): Promise<AdminDashboardDto> {
    const omzet = await this.getOmzet();

    return {
      status_stok: 'aman',
      omzet: !omzet ? 0 : omzet,
      barang_rusak: 0,
      pembayaran_lunas: 0,
      konsinyasi: 10,
    };
  }

  async getCashierDashboard(): Promise<CashierDashboardDto> {
    const omzet = await this.getOmzet();

    return {
      status_stok: 'aman',
      omzet: !omzet ? 0 : omzet,
      barang_rusak: 0,
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
}
