import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import {
  CreateSupplierDto,
  CreateSupplierPricelistDto,
  SupplierPricelistQuery,
  UpdateSupplierDto,
  UpdateSupplierPricelistDto,
} from './supplier.dto';

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

  async getPricelist({ id_supplier }: SupplierPricelistQuery) {
    const supplier = await this.prisma.supplier.count({
      where: {
        id_supplier,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier tidak ditemukan');
    }

    const results = await this.prisma.pricelist.findMany({
      where: {
        supplier_id: id_supplier,
      },
      select: {
        harga: true,
        created_at: true,
        updated_at: true,
        supplier: {
          select: {
            id_supplier: true,
            nama: true,
          },
        },
        produk: {
          select: {
            nama_produk: true,
            kode_item: true,
            subkategori: {
              select: {
                nama: true,
                kategori: {
                  select: {
                    nama: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      id_supplier: results[0].supplier.id_supplier,
      nama: results[0].supplier.nama,
      produk: results.map((item) => {
        const { harga, created_at, updated_at, produk } = item;

        return {
          nama: produk.nama_produk,
          kode_item: produk.kode_item,
          kategori: `${produk.subkategori.kategori.nama} - ${produk.subkategori.nama}`,
          harga,
          created_at,
          updated_at,
        };
      }),
    };
  }

  async createPricelist(body: CreateSupplierPricelistDto) {
    const supplier = await this.prisma.supplier.count({
      where: {
        id_supplier: body.supplier_id,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier tidak ditemukan');
    }

    await this.prisma.pricelist.create({
      data: {
        supplier_id: body.supplier_id,
        harga: body.harga,
        produk_id: body.produk_id,
      },
    });

    return body;
  }

  async updatePricelist(body: UpdateSupplierPricelistDto) {
    const supplier = await this.prisma.supplier.count({
      where: {
        id_supplier: body.supplier_id,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier tidak ditemukan');
    }

    await this.prisma.pricelist.updateMany({
      where: {
        supplier_id: body.supplier_id,
        produk_id: body.produk_id,
      },
      data: {
        harga: body.harga,
      },
    });

    return body;
  }

  async deletePricelist(params: { supplier_id: string; produk_id: string }) {
    const supplier = await this.prisma.supplier.count({
      where: {
        id_supplier: params.supplier_id,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier tidak ditemukan');
    }

    await this.prisma.pricelist.deleteMany({
      where: {
        supplier_id: params.supplier_id,
        produk_id: params.produk_id,
      },
    });

    return params;
  }
}
