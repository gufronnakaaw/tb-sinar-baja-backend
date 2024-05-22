import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { CreateSupplierDto, UpdateSupplierDto } from './supplier.dto';

@Injectable()
export class SupplierService {
  constructor(private prisma: PrismaService) {}

  getSupplier() {
    return this.prisma.supplier.findMany({
      select: {
        id_supplier: true,
        nama: true,
        email: true,
        no_telp: true,
        alamat_gudang: true,
        alamat_kantor: true,
        keterangan: true,
        bank: true,
        atas_nama: true,
        no_rekening: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async createSupplier(body: CreateSupplierDto) {
    const supplier = await this.prisma.supplier.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    if (supplier.length == 0) {
      await this.prisma.supplier.create({
        data: {
          id_supplier: 'SUP-1',
          nama: body.nama,
          email: body.email,
          no_telp: body.no_telp,
          alamat_gudang: body.alamat_gudang,
          alamat_kantor: body.alamat_kantor,
          keterangan: body.keterangan,
          bank: body.bank,
          atas_nama: body.atas_nama,
          no_rekening: body.no_rekening,
        },
      });
      return body;
    }

    if (
      supplier.find(
        (item) => item.nama.toLowerCase() == body.nama.toLowerCase(),
      )
    ) {
      throw new BadRequestException('Supplier sudah ada');
    }

    const splitId = supplier[0].id_supplier.split('-')[1];

    await this.prisma.supplier.create({
      data: {
        id_supplier: `SUP-${parseInt(splitId) + 1}`,
        nama: body.nama,
        email: body.email,
        no_telp: body.no_telp,
        alamat_gudang: body.alamat_gudang,
        alamat_kantor: body.alamat_kantor,
        keterangan: body.keterangan,
        bank: body.bank,
        atas_nama: body.atas_nama,
        no_rekening: body.no_rekening,
      },
    });

    return body;
  }

  async updateSupplier(body: UpdateSupplierDto) {
    const supplier = await this.prisma.supplier.count({
      where: {
        id_supplier: body.id_supplier,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier tidak ditemukan');
    }

    return this.prisma.supplier.update({
      where: {
        id_supplier: body.id_supplier,
      },
      data: {
        ...body,
      },
      select: {
        id_supplier: true,
        nama: true,
        email: true,
        no_telp: true,
        alamat_gudang: true,
        alamat_kantor: true,
        keterangan: true,
        bank: true,
        atas_nama: true,
        no_rekening: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async deleteSupplier(id_supplier: string) {
    const supplier = await this.prisma.supplier.count({
      where: {
        id_supplier,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier tidak ditemukan');
    }

    return this.prisma.supplier.delete({
      where: {
        id_supplier,
      },
      select: {
        id_supplier: true,
        nama: true,
        email: true,
        no_telp: true,
        alamat_gudang: true,
        alamat_kantor: true,
        keterangan: true,
        bank: true,
        atas_nama: true,
        no_rekening: true,
        created_at: true,
        updated_at: true,
      },
    });
  }
}
