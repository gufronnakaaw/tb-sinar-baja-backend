import { Injectable } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { KeuanganQuery } from './keuangan.dto';

@Injectable()
export class KeuanganService {
  constructor(private prisma: PrismaService) {}

  async getProfit(query: KeuanganQuery) {
    const limit = 7;
    const page = query.page ? parseInt(query.page) : 1;

    function generateDateRange(startDate: Date, endDate: Date) {
      const dates = [];
      const currentDate = startDate;

      while (currentDate >= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() - 1);
      }

      return dates;
    }

    const startDate = new Date(query.start);
    const today = new Date();
    const dateRange = generateDateRange(today, startDate);

    const transaksiPerHari = await this.prisma.transaksi.groupBy({
      by: ['created_at'],
      _sum: {
        total_pembayaran: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const result = dateRange.map((date) => {
      const tanggal = date.toISOString().split('T')[0];
      const transaksi = transaksiPerHari.filter((t) => {
        const parse = t.created_at.toISOString().split('T')[0];
        return parse == tanggal;
      });

      return {
        tanggal,
        total: transaksi.reduce((a, b) => a + b._sum.total_pembayaran, 0) || 0,
      };
    });

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      today: result.find((item) => {
        const date = new Date();
        const today = date.toISOString().split('T')[0];
        return item.tanggal == today;
      }),
      last_week: result.slice(start, end).filter((item) => {
        const date = new Date();
        const today = date.toISOString().split('T')[0];
        return item.tanggal != today;
      }),
      total_items: result.length,
      page,
    };
  }

  async detailProfit(date: string) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const transaksi = await this.prisma.transaksi.findMany({
      where: {
        created_at: {
          gte: start,
          lte: end,
        },
      },
      select: {
        id_transaksi: true,
        total_pembayaran: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return transaksi;
  }

  async getLoss(query: KeuanganQuery) {
    const limit = 7;
    const page = query.page ? parseInt(query.page) : 1;

    function generateDateRange(startDate: Date, endDate: Date) {
      const dates = [];
      const currentDate = startDate;

      while (currentDate >= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() - 1);
      }

      return dates;
    }

    const startDate = new Date(query.start);
    const today = new Date();
    const dateRange = generateDateRange(today, startDate);

    const beritaAcara = await this.prisma.beritaAcara.findMany({
      select: {
        id_ba: true,
        created_at: true,
        beritaacaradetail: {
          select: {
            total: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const mapping = beritaAcara.map((item) => {
      const tanggal = item.created_at.toISOString().split('T')[0];

      return {
        tanggal,
        total: item.beritaacaradetail.reduce((a, b) => a + b.total, 0),
      };
    });

    const result = dateRange.map((date) => {
      const tanggal = date.toISOString().split('T')[0];
      const berita = mapping.filter((t) => t.tanggal == tanggal);

      return {
        tanggal,
        total: berita.reduce((a, b) => a + b.total, 0) || 0,
      };
    });

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      today: result.find((item) => {
        const date = new Date();
        const today = date.toISOString().split('T')[0];
        return item.tanggal == today;
      }),
      last_week: result.slice(start, end).filter((item) => {
        const date = new Date();
        const today = date.toISOString().split('T')[0];
        return item.tanggal != today;
      }),
      total_items: result.length,
      page,
    };
  }

  async detailLoss(date: string) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const transaksi = await this.prisma.beritaAcara.findMany({
      where: {
        created_at: {
          gte: start,
          lte: end,
        },
      },
      select: {
        id_ba: true,
        created_at: true,
        beritaacaradetail: {
          select: {
            total: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return transaksi.map((item) => {
      return {
        id_ba: item.id_ba,
        created_at: item.created_at,
        total: item.beritaacaradetail.reduce((a, b) => a + b.total, 0),
      };
    });
  }

  async getDebt(query: KeuanganQuery) {
    const limit = 7;
    const page = query.page ? parseInt(query.page) : 1;

    const invoice = await this.prisma.invoice.findMany({
      select: {
        id_invoice: true,
        preorder_id: true,
        nomor_invoice: true,
        tagihan: true,
        sisa: true,
        jatuh_tempo: true,
        invoicedetail: {
          select: {
            jumlah: true,
          },
        },
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const hutang = await this.prisma.invoice.aggregate({
      _sum: {
        sisa: true,
      },
    });

    return {
      invoices: invoice.map((item) => {
        let status = '';
        if (item.invoicedetail.reduce((a, b) => a + b.jumlah, 0) == 0) {
          status += 'hutang';
        } else if (
          item.invoicedetail.reduce((a, b) => a + b.jumlah, 0) < item.tagihan
        ) {
          status += 'pembayaran';
        } else if (
          item.invoicedetail.reduce((a, b) => a + b.jumlah, 0) >= item.tagihan
        ) {
          status += 'lunas';
        }

        delete item.invoicedetail;

        return {
          ...item,
          status,
        };
      }),
      total_items: await this.prisma.invoice.count(),
      page,
      total: hutang._sum.sisa,
    };
  }

  async getReceivable(query: KeuanganQuery) {
    const limit = 7;
    const page = query.page ? parseInt(query.page) : 1;

    const transaksi = await this.prisma.transaksi.findMany({
      where: {
        metode: 'tempo',
      },
      select: {
        id_transaksi: true,
        penerima: true,
        total_pembayaran: true,
        status: true,
        invoicekeluar: {
          select: {
            id_invoice: true,
            sisa: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const piutang = await this.prisma.invoiceKeluar.aggregate({
      _sum: {
        sisa: true,
      },
    });

    return {
      transaksi: transaksi.map((item) => {
        const { invoicekeluar, ...all } = item;

        return {
          ...all,
          id_invoice: invoicekeluar.length ? invoicekeluar[0].id_invoice : null,
          sisa: invoicekeluar.length ? invoicekeluar[0].sisa : null,
        };
      }),
      total_items: await this.prisma.transaksi.count({
        where: { metode: 'tempo' },
      }),
      page,
      total: piutang._sum.sisa,
    };
  }
}
