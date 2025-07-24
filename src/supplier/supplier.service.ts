import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import {
  CreateBankDto,
  CreateSupplierDto,
  CreateSupplierPricelistDto,
  SupplierPricelistQuery,
  UpdateBankDto,
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
        supplierbank: {
          select: {
            id_table: true,
            nama: true,
            atas_nama: true,
            no_rekening: true,
            created_at: true,
            updated_at: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  getSupplierBank(id_supplier: string) {
    return this.prisma.supplierBank.findMany({
      where: {
        supplier_id: id_supplier,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async createSupplierBank(body: CreateBankDto) {
    if (
      !(await this.prisma.supplier.count({
        where: {
          id_supplier: body.id_supplier,
        },
      }))
    ) {
      throw new NotFoundException('Supplier tidak ditemukan');
    }

    return this.prisma.supplierBank.create({
      data: {
        supplier_id: body.id_supplier,
        nama: body.nama,
        atas_nama: body.atas_nama,
        no_rekening: body.no_rekening,
      },
    });
  }

  async updateSupplierBank(body: UpdateBankDto) {
    if (
      !(await this.prisma.supplierBank.count({
        where: {
          id_table: body.bank_id,
        },
      }))
    ) {
      throw new NotFoundException('Bank tidak ditemukan');
    }

    return this.prisma.supplierBank.update({
      where: {
        id_table: body.bank_id,
      },
      data: {
        nama: body.nama,
        atas_nama: body.atas_nama,
        no_rekening: body.no_rekening,
      },
    });
  }

  async deleteSupplierBank(params: { supplier_id: string; id_table: string }) {
    const supplier = await this.prisma.supplier.count({
      where: {
        id_supplier: params.supplier_id,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier tidak ditemukan');
    }

    await this.prisma.supplierBank.delete({
      where: {
        supplier_id: params.supplier_id,
        id_table: parseInt(params.id_table),
      },
    });

    return params;
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
          supplierbank: {
            createMany: {
              data: body.bank.map((item) => {
                return {
                  nama: item.nama,
                  atas_nama: item.atas_nama,
                  no_rekening: item.no_rekening,
                };
              }),
            },
          },
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
        supplierbank: {
          createMany: {
            data: body.bank.map((item) => {
              return {
                nama: item.nama,
                atas_nama: item.atas_nama,
                no_rekening: item.no_rekening,
              };
            }),
          },
        },
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

    await this.prisma.supplier.update({
      where: {
        id_supplier: body.id_supplier,
      },
      data: {
        ...body,
      },
    });

    return body;
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
        harga_grosir: true,
        created_at: true,
        updated_at: true,
        produk: {
          select: {
            nama_produk: true,
            kode_item: true,
            satuan_besar: true,
            satuan_kecil: true,
            isi_satuan_besar: true,
            kode_pabrik: true,
            merk: true,
            nama_produk_asli: true,
            nama_produk_sebutan: true,
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
      orderBy: {
        created_at: 'desc',
      },
    });

    return results.map((item) => {
      const { harga, created_at, updated_at, produk, harga_grosir } = item;
      const { subkategori } = produk;
      delete produk.subkategori;

      return {
        ...produk,
        kategori: `${subkategori.kategori.nama} - ${subkategori.nama}`,
        harga,
        harga_grosir,
        created_at,
        updated_at,
      };
    });
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

    if (
      await this.prisma.pricelist.count({
        where: {
          supplier_id: body.supplier_id,
          produk_id: body.produk_id,
        },
      })
    ) {
      throw new BadRequestException('Produk sudah ada');
    }

    await this.prisma.pricelist.create({
      data: {
        supplier_id: body.supplier_id,
        harga: body.harga,
        harga_grosir: body.harga_grosir,
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
        harga_grosir: body.harga_grosir,
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
