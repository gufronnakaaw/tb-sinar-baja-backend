import { Injectable, NotFoundException } from '@nestjs/common';
import { generateID } from '../utils/generate.util';
import { PrismaService } from '../utils/services/prisma.service';
import { CreatePreorderDto } from './preorder.dto';

@Injectable()
export class PreorderService {
  constructor(private prisma: PrismaService) {}

  async getPreorder() {
    const preorder = await this.prisma.preorder.findMany({
      select: {
        id_preorder: true,
        supplier_id: true,
        nama_supplier: true,
        email_supplier: true,
        no_telp: true,
        alamat: true,
        keterangan: true,
        tipe: true,
        total: true,
        created_at: true,
        invoice: {
          select: {
            tagihan: true,
            invoicedetail: {
              select: {
                jumlah: true,
              },
            },
          },
        },
        entry: {
          select: {
            kode_item: true,
          },
        },
        preorderdetail: {
          select: {
            kode_item: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return preorder.map((item) => {
      const { invoice, entry, preorderdetail } = item;
      delete item.entry;
      delete item.preorderdetail;

      let status = '';

      if (!invoice.length) {
        status += 'kosong';
        delete item.invoice;
      } else {
        if (invoice[0].invoicedetail.reduce((a, b) => a + b.jumlah, 0) == 0) {
          status += 'hutang';
        } else if (
          invoice[0].invoicedetail.reduce((a, b) => a + b.jumlah, 0) <
          invoice[0].tagihan
        ) {
          status += 'pembayaran';
        } else if (
          invoice[0].invoicedetail.reduce((a, b) => a + b.jumlah, 0) >=
          invoice[0].tagihan
        ) {
          status += 'lunas';
        }

        delete item.invoice;
      }

      return {
        ...item,
        sumber: !item.supplier_id ? 'non_supplier' : 'supplier',
        status,
        entry_gudang: Boolean(entry.length),
        item_masuk: entry.length,
        item_order: preorderdetail.length,
      };
    });
  }

  async getPreorderById(id_preorder: string) {
    const result = await this.prisma.preorder.findUnique({
      where: {
        id_preorder,
      },
      select: {
        id_preorder: true,
        supplier_id: true,
        nama_supplier: true,
        email_supplier: true,
        no_telp: true,
        alamat: true,
        keterangan: true,
        tipe: true,
        total: true,
        preorderdetail: {
          select: {
            kode_item: true,
            kode_pabrik: true,
            nama_produk: true,
            qty: true,
            satuan: true,
            harga: true,
            jumlah: true,
          },
        },
        created_at: true,
      },
    });

    const { preorderdetail } = result;
    delete result.preorderdetail;

    return {
      ...result,
      produk: preorderdetail,
      sumber: !result.supplier_id ? 'non_supplier' : 'supplier',
    };
  }

  async createPreorder(body: CreatePreorderDto) {
    const date = new Date();

    const produk = body.produk.map((item) => {
      return {
        kode_item: item.kode_item,
        kode_pabrik: item.kode_pabrik,
        nama_produk: item.nama_produk,
        qty: item.qty,
        satuan: item.satuan,
        harga: !item.subharga ? item.harga : item.subharga,
        jumlah: item.jumlah,
      };
    });

    if (body.tipe == 'non_supplier') {
      return this.prisma.preorder.create({
        data: {
          id_preorder: generateID('PO', date),
          supplier_id: null,
          nama_supplier: body.nama_supplier,
          email_supplier: body.email_supplier,
          alamat: body.alamat,
          keterangan: body.keterangan,
          no_telp: body.no_telp,
          tipe: 'non_supplier',
          total: body.total,
          preorderdetail: {
            createMany: {
              data: produk,
            },
          },
          created_at: date,
          updated_at: date,
        },
      });
    }

    const supplier = await this.prisma.supplier.findUnique({
      where: {
        id_supplier: body.supplier_id,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier tidak ditemukan');
    }

    return this.prisma.preorder.create({
      data: {
        id_preorder: generateID('PO', date),
        supplier_id: supplier.id_supplier,
        nama_supplier: supplier.nama,
        email_supplier: supplier.email,
        no_telp: supplier.no_telp,
        alamat: supplier.alamat_kantor,
        keterangan: supplier.keterangan,
        tipe: 'supplier',
        total: body.total,
        preorderdetail: {
          createMany: {
            data: produk,
          },
        },
        created_at: date,
        updated_at: date,
      },
    });
  }
}
