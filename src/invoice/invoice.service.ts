import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/services/prisma.service';
import { generateID } from '../utils/generate.util';
import { CreateInvoiceDto, CreateInvoicePaymentDto } from './invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async getInvoice() {
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
    });

    return invoice.map((item) => {
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
    });
  }

  async getInvoiceById(id_invoice: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: {
        id_invoice,
      },
      select: {
        id_invoice: true,
        preorder_id: true,
        nomor_invoice: true,
        tagihan: true,
        sisa: true,
        jatuh_tempo: true,
        preorder: {
          select: {
            supplier_id: true,
          },
        },
        invoicedetail: {
          select: {
            id_transaksi: true,
            nama_bank: true,
            atas_nama: true,
            no_rekening: true,
            tipe: true,
            jumlah: true,
            created_at: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
        created_at: true,
      },
    });

    let status = '';
    if (invoice.invoicedetail.reduce((a, b) => a + b.jumlah, 0) == 0) {
      status += 'hutang';
    } else if (
      invoice.invoicedetail.reduce((a, b) => a + b.jumlah, 0) < invoice.tagihan
    ) {
      status += 'pembayaran';
    } else if (
      invoice.invoicedetail.reduce((a, b) => a + b.jumlah, 0) >= invoice.tagihan
    ) {
      status += 'lunas';
    }

    const { preorder } = invoice;
    delete invoice.preorder;

    return {
      ...invoice,
      status,
      sumber: !preorder.supplier_id ? 'non_supplier' : 'supplier',
    };
  }

  async createInvoice(body: CreateInvoiceDto) {
    const po = await this.prisma.preorder.count({
      where: {
        id_preorder: body.preorder_id,
      },
    });

    if (!po) {
      throw new NotFoundException('Preorder tidak ditemukan');
    }

    const invoice = await this.prisma.invoice.count({
      where: {
        preorder_id: body.preorder_id,
      },
    });

    if (invoice) {
      throw new BadRequestException('Invoice sudah ada');
    }

    const date = new Date();

    return this.prisma.invoice.create({
      data: {
        id_invoice: generateID('INV', date),
        preorder_id: body.preorder_id,
        nomor_invoice: body.nomor_invoice,
        tagihan: body.tagihan,
        sisa: body.sisa,
        jatuh_tempo: body.jatuh_tempo,
        created_at: date,
        updated_at: date,
      },
    });
  }

  async createPayment(body: CreateInvoicePaymentDto) {
    const invoice = await this.prisma.invoice.findUnique({
      where: {
        id_invoice: body.invoice_id,
      },
      include: {
        invoicedetail: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice tidak ditemukan');
    }

    if (
      invoice.invoicedetail.reduce((a, b) => a + b.jumlah, 0) == invoice.tagihan
    ) {
      throw new BadRequestException('Invoice sudah lunas');
    }

    if (body.sumber == 'supplier') {
      const supplierbank = await this.prisma.supplierBank.findUnique({
        where: {
          id_table: body.bank_id,
        },
      });

      if (!supplierbank) {
        throw new NotFoundException('Bank tidak ditemukan');
      }

      await this.prisma.$transaction([
        this.prisma.invoice.update({
          where: {
            id_invoice: body.invoice_id,
          },
          data: {
            sisa: {
              decrement: body.jumlah,
            },
          },
        }),

        this.prisma.invoiceDetail.create({
          data: {
            invoice_id: body.invoice_id,
            id_transaksi: body.id_transaksi,
            nama_bank: supplierbank.nama,
            atas_nama: supplierbank.atas_nama,
            no_rekening: supplierbank.no_rekening,
            tipe: body.tipe,
            jumlah: body.jumlah,
          },
        }),
      ]);

      return body;
    }

    await this.prisma.$transaction([
      this.prisma.invoice.update({
        where: {
          id_invoice: body.invoice_id,
        },
        data: {
          sisa: {
            decrement: body.jumlah,
          },
        },
      }),

      this.prisma.invoiceDetail.create({
        data: {
          invoice_id: body.invoice_id,
          id_transaksi: body.id_transaksi,
          nama_bank: body.nama_bank,
          atas_nama: body.atas_nama,
          no_rekening: body.no_rekening,
          tipe: body.tipe,
          jumlah: body.jumlah,
        },
      }),
    ]);

    return body;
  }
}
