import { Injectable, NotFoundException } from '@nestjs/common';
import { generateID } from '../utils/generate.util';
import { PrismaService } from '../utils/services/prisma.service';
import {
  CreatePenawaranDto,
  UpdatePenawaranDto,
  UpdateStatusPenawaranDto,
} from './penawaran.dto';

@Injectable()
export class PenawaranService {
  constructor(private prisma: PrismaService) {}

  getPenawaran() {
    return this.prisma.penawaran.findMany({
      select: {
        id_penawaran: true,
        supplier_id: true,
        nama_supplier: true,
        email_supplier: true,
        no_telp: true,
        alamat: true,
        status: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async getPenawaranById(id_penawaran: string) {
    const result = await this.prisma.penawaran.findUnique({
      where: {
        id_penawaran,
      },
      select: {
        id_penawaran: true,
        supplier_id: true,
        nama_supplier: true,
        email_supplier: true,
        no_telp: true,
        alamat: true,
        status: true,
        penawarandetail: {
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

    const { penawarandetail } = result;
    delete result.penawarandetail;

    return {
      ...result,
      produk: penawarandetail,
    };
  }

  async createPenawaran(body: CreatePenawaranDto) {
    const supplier = await this.prisma.supplier.findUnique({
      where: {
        id_supplier: body.supplier_id,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier tidak ditemukan');
    }

    const date = new Date();

    const produk = body.produk.map((item) => {
      return {
        kode_item: item.kode_item,
        kode_pabrik: item.kode_pabrik,
        nama_produk: item.nama_produk,
        qty: item.qty,
        satuan: item.satuan,
        harga: item.harga,
        jumlah: item.jumlah,
      };
    });

    return this.prisma.penawaran.create({
      data: {
        id_penawaran: generateID('OFFER', date),
        supplier_id: body.supplier_id,
        nama_supplier: supplier.nama,
        email_supplier: supplier.email,
        alamat: supplier.alamat_kantor,
        no_telp: supplier.no_telp,
        penawarandetail: {
          createMany: {
            data: produk,
          },
        },
        created_at: date,
        updated_at: date,
      },
    });
  }

  async updatePenawaran(id_penawaran: string, body: UpdatePenawaranDto) {
    const penawaran = await this.prisma.penawaran.findUnique({
      where: {
        id_penawaran,
      },
    });

    if (!penawaran) {
      throw new NotFoundException('Penawaran tidak ditemukan');
    }

    const supplier = await this.prisma.supplier.findUnique({
      where: {
        id_supplier: body.supplier_id,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier tidak ditemukan');
    }

    const date = new Date();

    const produk = body.produk.map((item) => {
      return {
        kode_item: item.kode_item,
        kode_pabrik: item.kode_pabrik,
        nama_produk: item.nama_produk,
        qty: item.qty,
        satuan: item.satuan,
        harga: item.harga,
        jumlah: item.jumlah,
      };
    });

    await this.prisma.penawaranDetail.deleteMany({
      where: {
        penawaran_id: id_penawaran,
      },
    });

    return this.prisma.penawaran.update({
      where: {
        id_penawaran,
      },
      data: {
        supplier_id: body.supplier_id,
        nama_supplier: supplier.nama,
        email_supplier: supplier.email,
        alamat: supplier.alamat_kantor,
        no_telp: supplier.no_telp,
        penawarandetail: {
          createMany: {
            data: produk,
          },
        },
        updated_at: date,
      },
    });
  }

  async updateStatus(body: UpdateStatusPenawaranDto) {
    const penawaran = await this.prisma.penawaran.count({
      where: {
        id_penawaran: body.id_penawaran,
      },
    });

    if (!penawaran) {
      throw new NotFoundException('Penawaran tidak ditemukan');
    }

    return this.prisma.penawaran.update({
      where: {
        id_penawaran: body.id_penawaran,
      },
      data: {
        status: body.status,
      },
    });
  }
}
