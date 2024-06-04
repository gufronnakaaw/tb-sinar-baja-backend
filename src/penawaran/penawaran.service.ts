import { Injectable, NotFoundException } from '@nestjs/common';
import { generateID } from '../utils/generate.util';
import { PrismaService } from '../utils/services/prisma.service';
import { CreatePenawaranDto, UpdateStatusPenawaranDto } from './penawaran.dto';

@Injectable()
export class PenawaranService {
  constructor(private prisma: PrismaService) {}

  async getPenawaran() {
    const result = await this.prisma.penawaran.findMany({
      select: {
        id_penawaran: true,
        status: true,
        supplier: {
          select: {
            nama: true,
            id_supplier: true,
          },
        },
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return result.map((item) => {
      return {
        ...item,
        id_supplier: item.supplier.id_supplier,
        supplier: item.supplier.nama,
      };
    });
  }

  async getPenawaranById(id_penawaran: string) {
    const result = await this.prisma.penawaran.findUnique({
      where: {
        id_penawaran,
      },
      select: {
        id_penawaran: true,
        status: true,
        supplier: {
          select: {
            id_supplier: true,
            nama: true,
            alamat_kantor: true,
            no_telp: true,
            email: true,
          },
        },
        penawarandetail: {
          select: {
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

    const { supplier, created_at, penawarandetail, status } = result;

    return {
      id_penawaran: result.id_penawaran,
      ...supplier,
      status,
      produk: penawarandetail,
      created_at,
    };
  }

  createPenawaran(body: CreatePenawaranDto) {
    const date = new Date();

    const produk = body.produk.map((item) => {
      return {
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
