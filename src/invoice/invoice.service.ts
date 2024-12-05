import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/services/prisma.service';
import { generateID } from '../utils/generate.util';
import {
  CreateInvoiceDto,
  CreateInvoicePaymentDto,
  PaymentInvoutDto,
  UpdateInvoutDto,
} from './invoice.dto';

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
        preorder: {
          select: {
            nama_supplier: true,
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

      const nama_supplier = item.preorder.nama_supplier;

      delete item.invoicedetail;
      delete item.preorder;

      return {
        ...item,
        nama_supplier,
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
            nama_supplier: true,
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
      nama_supplier: preorder.nama_supplier,
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
      if (body.tipe == 'cash') {
        return this.prisma.$transaction([
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
              tipe: body.tipe,
              jumlah: body.jumlah,
            },
          }),
        ]);
      }

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

  async getInvout() {
    const result = await this.prisma.invoiceKeluar.findMany({
      select: {
        id_invoice: true,
        transaksi_id: true,
        dp: true,
        tagihan: true,
        sisa: true,
        jatuh_tempo: true,
        created_at: true,
        transaksi: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return result.map((item) => {
      const { transaksi, ...invout } = item;
      const { status } = transaksi;

      delete item.transaksi;

      return {
        ...invout,
        status,
      };
    });
  }

  async getInvoutById(id_invoice: string) {
    const result = await this.prisma.invoiceKeluar.findUnique({
      where: {
        id_invoice,
      },
      select: {
        id_invoice: true,
        dp: true,
        tagihan: true,
        sisa: true,
        jatuh_tempo: true,
        created_at: true,
        transaksi: {
          include: {
            transaksidetail: {
              select: {
                kode_item: true,
                jumlah: true,
                satuan: true,
                nama_produk: true,
                harga: true,
                gudang: true,
                rak: true,
                sub_total: true,
                diskon_langsung_item: true,
                diskon_persen_item: true,
              },
            },
          },
        },
        invoicekeluardetail: {
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
      },
    });

    const { transaksi, ...invout } = result;

    delete transaksi.id_table;

    const { transaksidetail } = transaksi;
    delete transaksi.transaksidetail;

    return {
      ...invout,
      transaksi: {
        ...transaksi,
        list_produk: transaksidetail,
      },
    };
  }

  async paymentInvout(body: PaymentInvoutDto) {
    const invout = await this.prisma.invoiceKeluar.count({
      where: {
        id_invoice: body.invoice_id,
      },
    });

    if (!invout) {
      throw new NotFoundException('Invoice tidak ditemukan');
    }

    await this.prisma.$transaction([
      this.prisma.invoiceKeluar.update({
        where: {
          id_invoice: body.invoice_id,
        },
        data: {
          sisa: {
            decrement: body.jumlah,
          },
        },
      }),
      this.prisma.invoiceKeluarDetail.create({
        data: {
          invoice_id: body.invoice_id,
          atas_nama: body.atas_nama,
          nama_bank: body.nama_bank,
          no_rekening: body.no_rekening,
          id_transaksi: body.id_transaksi,
          jumlah: body.jumlah,
          tipe: body.tipe,
        },
      }),
    ]);

    const update = await this.prisma.invoiceKeluar.findUnique({
      where: {
        id_invoice: body.invoice_id,
      },
      select: {
        transaksi_id: true,
        tagihan: true,
        invoicekeluardetail: {
          select: {
            jumlah: true,
          },
        },
      },
    });

    await this.prisma.transaksi.update({
      where: {
        id_transaksi: update.transaksi_id,
      },
      data: {
        status:
          update.invoicekeluardetail.reduce((a, b) => a + b.jumlah, 0) >=
          update.tagihan
            ? 'lunas'
            : 'piutang',
      },
    });
  }

  async updateInvout(body: UpdateInvoutDto) {
    if (
      !(await this.prisma.invoiceKeluar.count({
        where: { id_invoice: body.invoice_id },
      }))
    ) {
      throw new NotFoundException('Invoice tidak ditemukan');
    }

    return this.prisma.invoiceKeluar.update({
      where: {
        id_invoice: body.invoice_id,
      },
      data: {
        jatuh_tempo: body.jatuh_tempo,
      },
    });
  }
}
