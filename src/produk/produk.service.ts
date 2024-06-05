import { Injectable } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import {
  CreateBulkProduk,
  ProdukQuery,
  UpdateProdukDto,
  UpdateStokProdukType,
} from './produk.dto';

@Injectable()
export class ProdukService {
  constructor(private prisma: PrismaService) {}

  async createBulkProduk(body: CreateBulkProduk) {
    for (const item of body.produk) {
      const data = {
        barcode: item.barcode,
        kode_pabrik: item.kode_pabrik,
        kode_toko: item.kode_toko,
        kode_supplier: item.kode_supplier,
        gudang_id: item.gudang_id,
        nama_produk: item.nama_produk,
        nama_produk_asli: item.nama_produk_asli,
        nama_produk_sebutan: item.nama_produk_sebutan,
        rak: item.rak,
        harga_1: item.harga_1,
        harga_2: item.harga_2,
        harga_3: item.harga_3,
        harga_4: item.harga_4,
        harga_5: item.harga_5,
        harga_6: item.harga_6,
        harga_pokok: item.harga_pokok,
        harga_diskon: item.harga_diskon,
        berat: item.berat,
        volume: item.volume,
        konversi: item.konversi,
        stok: item.stok,
        stok_aman: item.stok_aman,
        isi_satuan_besar: item.isi_satuan_besar,
        merk: item.merk,
        satuan_besar: item.satuan_besar,
        satuan_kecil: item.satuan_kecil,
        tipe: item.tipe,
        subkategori_id: item.subkategori_id,
      };

      await this.prisma.produk.upsert({
        where: {
          kode_item: item.kode_item,
        },
        create: { kode_item: item.kode_item, ...data },
        update: data,
      });
    }
  }

  async getProdukByKodeItem(kode_item: string) {
    const produk = await this.prisma.produk.findUnique({
      include: {
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
        gudang: {
          select: {
            nama: true,
          },
        },
      },
      where: {
        kode_item,
      },
    });

    const { subkategori } = produk;
    delete produk.id_table;
    delete produk.gudang_id;
    delete produk.subkategori_id;

    return {
      ...produk,
      subkategori: subkategori.nama,
      kategori: subkategori.kategori.nama,
      gudang: produk.gudang.nama,
    };
  }

  async getProdukBySubkategori(id_subkategori: string) {
    const produk = await this.prisma.produk.findMany({
      include: {
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
        gudang: {
          select: {
            nama: true,
          },
        },
      },
      where: {
        subkategori_id: id_subkategori,
      },
    });

    return produk.map((item) => {
      const { subkategori } = item;
      delete item.id_table;
      delete item.gudang_id;
      delete item.subkategori_id;

      return {
        ...item,
        subkategori: subkategori.nama,
        kategori: subkategori.kategori.nama,
        gudang: item.gudang.nama,
      };
    });
  }

  async getProduk({ search, ...props }: ProdukQuery) {
    const defaultPage = 1;
    const defaultSize = 10;

    const page = parseInt(`${props.page}`)
      ? parseInt(`${props.page}`)
      : defaultPage;
    const size = parseInt(`${props.size}`)
      ? parseInt(`${props.size}`)
      : defaultSize;

    const skip = (page - 1) * size;

    if (search) {
      const produk = await this.prisma.produk.findMany({
        include: {
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
          gudang: {
            select: {
              nama: true,
            },
          },
        },
        where: {
          OR: [
            {
              kode_item: {
                contains: search,
              },
            },
            {
              nama_produk: {
                contains: search,
              },
            },
            {
              nama_produk_asli: {
                contains: search,
              },
            },
            {
              nama_produk_sebutan: {
                contains: search,
              },
            },
            {
              merk: {
                contains: search,
              },
            },
          ],
          AND: [
            {
              stok: {
                gt: 0,
              },
            },
          ],
        },
        take: 25,
      });

      return produk.map((item) => {
        delete item.subkategori_id;
        delete item.id_table;
        delete item.gudang_id;

        const { subkategori, gudang, stok, stok_aman } = item;

        const warning = Math.round((stok_aman / 100) * 50);
        const danger = Math.round((stok_aman / 100) * 15);

        let status_stok: string = '';

        if (stok > stok_aman || stok > warning) {
          status_stok += 'aman';
        } else if (stok <= warning && stok > danger) {
          status_stok += 'menipis';
        } else {
          status_stok += 'bahaya';
        }

        return {
          ...item,
          kategori: subkategori.kategori.nama,
          subkategori: subkategori.nama,
          gudang: gudang.nama,
          status_stok,
        };
      });
    }

    const [totalProduk, resultProduk] = await this.prisma.$transaction([
      this.prisma.produk.count(),
      this.prisma.produk.findMany({
        include: {
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
          gudang: {
            select: {
              nama: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        take: size,
        skip,
      }),
    ]);

    const produk = resultProduk.map((item) => {
      delete item.subkategori_id;
      delete item.id_table;
      delete item.gudang_id;

      const { subkategori, stok, stok_aman, gudang } = item;

      const warning = Math.round((stok_aman / 100) * 50);
      const danger = Math.round((stok_aman / 100) * 15);

      let status_stok: string = '';

      if (stok > stok_aman || stok > warning) {
        status_stok += 'aman';
      } else if (stok <= warning && stok > danger) {
        status_stok += 'menipis';
      } else {
        status_stok += 'bahaya';
      }

      return {
        ...item,
        kategori: subkategori.kategori.nama,
        subkategori: subkategori.nama,
        gudang: gudang.nama,
        status_stok,
      };
    });

    return {
      produk,
      page,
      total_items: totalProduk,
      total_page: Math.ceil(totalProduk / size),
    };
  }

  updateProduk({ kode_item, ...props }: UpdateProdukDto) {
    return this.prisma.produk.update({
      where: {
        kode_item: kode_item,
      },
      data: {
        ...props,
      },
    });
  }

  updateStokProduk(body: UpdateStokProdukType) {
    if (!body.tipe) {
      return this.prisma.produk.update({
        where: {
          kode_item: body.kode_item,
        },
        data: {
          stok_aman: body.stok_aman,
        },
      });
    }

    if (body.tipe == 'increment') {
      return this.prisma.produk.update({
        where: {
          kode_item: body.kode_item,
        },
        data: {
          stok: {
            increment: body.stok,
          },
        },
      });
    }

    if (body.tipe == 'decrement') {
      return this.prisma.produk.update({
        where: {
          kode_item: body.kode_item,
        },
        data: {
          stok: {
            decrement: body.stok,
          },
        },
      });
    }
  }

  async filter(id_kategori: number) {
    const result = await this.prisma.kategori.findUnique({
      where: {
        id_kategori,
      },
      include: {
        subkategori: {
          include: {
            produk: true,
          },
        },
      },
    });

    // const result = [];
    // for (const item of produk) {
    //   result.push(
    //     ...item.produk.map((element) => {
    //       delete element.id_table;
    //       delete element.created_at;
    //       delete element.updated_at;

    //       return {
    //         ...element,
    //       };
    //     }),
    //   );
    // }

    const { nama, subkategori } = result;

    const produk = [];

    for (const item of subkategori) {
      produk.push(
        ...item.produk.map((element) => {
          const { subkategori_id, gudang_id } = element;
          delete element.id_table;
          delete element.created_at;
          delete element.updated_at;
          delete element.subkategori_id;
          delete element.gudang_id;

          return {
            nama_sub_kategori_produk: item.nama,
            sub_kategori_produk: subkategori_id,
            merk: element.merk,
            nama_produk: element.nama_produk,
            kode_item: element.kode_item,
            nama_produk_asli: element.nama_produk_asli,
            kode_supplier: element.kode_supplier,
            satuan_kecil: element.satuan_kecil,
            satuan_besar: element.satuan_besar,
            isi_satuan_besar: element.isi_satuan_besar,
            harga_pokok: !element.harga_pokok ? 0 : element.harga_pokok,
            harga_1: !element.harga_1 ? 0 : element.harga_1,
            harga_2: !element.harga_2 ? 0 : element.harga_2,
            harga_3: !element.harga_3 ? 0 : element.harga_3,
            harga_4: !element.harga_4 ? 0 : element.harga_4,
            harga_5: !element.harga_5 ? 0 : element.harga_5,
            harga_6: !element.harga_6 ? 0 : element.harga_6,
            gudang: gudang_id,
            rak: element.rak,
            stok: element.stok,
            stok_aman: element.stok_aman,
            nama_produk_sebutan: element.nama_produk_sebutan,
            konversi: element.konversi,
            berat: element.berat,
            volume: element.volume,
            tipe: element.tipe,
            barcode: element.barcode,
            kode_pabrik: element.kode_pabrik,
            kode_toko: element.kode_toko,
          };
        }),
      );
    }

    return {
      id_kategori: result.id_kategori,
      nama,
      produk,
    };
  }
}
