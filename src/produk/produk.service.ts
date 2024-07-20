import { Injectable } from '@nestjs/common';
import { removeKeys } from '../utils/removekey.util';
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
    const promises = body.produk.map(async (item) => {
      const data = {
        barcode: item.barcode,
        kode_pabrik: item.kode_pabrik,
        kode_toko: item.kode_toko,
        kode_supplier: item.kode_supplier,
        nama_produk: item.nama_produk,
        nama_produk_asli: item.nama_produk_asli,
        nama_produk_sebutan: item.nama_produk_sebutan,
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
        isi_satuan_besar: item.isi_satuan_besar,
        merk: item.merk,
        satuan_besar: item.satuan_besar,
        satuan_kecil: item.satuan_kecil,
        tipe: item.tipe,
        subkategori_id: item.subkategori_id,
      };

      const produk = await this.prisma.produk.count({
        where: {
          kode_item: item.kode_item,
        },
      });

      if (!produk) {
        return this.createSingleProduk({
          data: {
            kode_item: item.kode_item,
            ...data,
            stock: {
              create: {
                stok: item.stok,
                stok_aman: item.stok_aman,
                gudang_id: body.gudang_id,
                rak: item.rak,
              },
            },
          },
        });
      } else {
        const stock = await this.prisma.stock.count({
          where: {
            produk_id: item.kode_item,
            gudang_id: body.gudang_id,
          },
        });

        if (!stock) {
          return this.updateSingleProduk({
            where: {
              kode_item: item.kode_item,
            },
            data: {
              ...data,
              stock: {
                create: {
                  stok: item.stok,
                  stok_aman: item.stok_aman,
                  gudang_id: body.gudang_id,
                  rak: item.rak,
                },
              },
            },
          });
        } else {
          return this.updateSingleProduk({
            where: {
              kode_item: item.kode_item,
            },
            data: {
              ...data,
              stock: {
                updateMany: {
                  where: {
                    produk_id: item.kode_item,
                    gudang_id: body.gudang_id,
                  },
                  data: {
                    stok: item.stok,
                    stok_aman: item.stok_aman,
                    rak: item.rak,
                  },
                },
              },
            },
          });
        }
      }
    });

    await Promise.all(promises);

    return {
      total: body.produk.length,
    };
  }

  async createBulkProdukV2({ gudang_id, produk }: CreateBulkProduk) {
    for (const item of produk) {
      const data = {
        barcode: item.barcode,
        kode_pabrik: item.kode_pabrik,
        kode_toko: item.kode_toko,
        kode_supplier: item.kode_supplier,
        nama_produk: item.nama_produk,
        nama_produk_asli: item.nama_produk_asli,
        nama_produk_sebutan: item.nama_produk_sebutan,
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
        isi_satuan_besar: item.isi_satuan_besar,
        merk: item.merk,
        satuan_besar: item.satuan_besar,
        satuan_kecil: item.satuan_kecil,
        tipe: item.tipe,
        subkategori_id: item.subkategori_id,
      };

      const produk = await this.prisma.produk.count({
        where: {
          kode_item: item.kode_item,
        },
      });

      if (!produk) {
        await this.prisma.produk.create({
          data: {
            kode_item: item.kode_item,
            ...data,
            stock: {
              create: {
                stok: item.stok,
                stok_aman: item.stok_aman,
                gudang_id: gudang_id,
                rak: item.rak,
              },
            },
          },
        });
      } else {
        const stock = await this.prisma.stock.count({
          where: {
            produk_id: item.kode_item,
            gudang_id: gudang_id,
          },
        });

        if (!stock) {
          await this.prisma.produk.update({
            where: {
              kode_item: item.kode_item,
            },
            data: {
              ...data,
              stock: {
                create: {
                  stok: item.stok,
                  stok_aman: item.stok_aman,
                  gudang_id: gudang_id,
                  rak: item.rak,
                },
              },
            },
          });
        } else {
          await this.prisma.produk.update({
            where: {
              kode_item: item.kode_item,
            },
            data: {
              ...data,
              stock: {
                updateMany: {
                  where: {
                    produk_id: item.kode_item,
                    gudang_id: gudang_id,
                  },
                  data: {
                    stok: item.stok,
                    stok_aman: item.stok_aman,
                    rak: item.rak,
                  },
                },
              },
            },
          });
        }
      }
    }

    return {
      total: produk.length,
    };
  }

  async createSingleProduk(item: any) {
    await this.prisma.produk.create(item);
  }

  async updateSingleProduk(item: any) {
    await this.prisma.produk.update(item);
  }

  async getProdukByKodeItem(kode_item: string) {
    const result = await this.prisma.produk.findUnique({
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
        stock: {
          select: {
            stok: true,
            stok_aman: true,
            rak: true,
            gudang: {
              select: {
                nama: true,
                kode_gudang: true,
              },
            },
          },
        },
      },
      where: {
        kode_item,
      },
    });

    const { subkategori, stock } = result;

    const gudang = [];
    let total_stok = 0;
    let total_stok_aman = 0;

    for (const item of stock) {
      const { stok, stok_aman, rak } = item;

      gudang.push({ stok, stok_aman, rak, ...item.gudang });

      total_stok += item.stok;
      total_stok_aman += item.stok_aman;
    }

    const produk = removeKeys(result, ['id_table', 'subkategori_id', 'stock']);

    return {
      ...produk,
      subkategori: subkategori.nama,
      kategori: subkategori.kategori.nama,
      gudang,
      total_stok,
      total_stok_aman,
    };
  }

  async getProdukBySubkategori(id_subkategori: string) {
    const result = await this.prisma.produk.findMany({
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
        stock: {
          select: {
            stok: true,
            stok_aman: true,
            rak: true,
            gudang: {
              select: {
                nama: true,
                kode_gudang: true,
              },
            },
          },
        },
      },
      where: {
        subkategori_id: id_subkategori,
      },
    });

    return result.map((element) => {
      const { subkategori, stock } = element;

      const gudang = [];
      let total_stok = 0;
      let total_stok_aman = 0;

      for (const item of stock) {
        const { stok, stok_aman, rak } = item;

        gudang.push({ stok, stok_aman, rak, ...item.gudang });

        total_stok += item.stok;
        total_stok_aman += item.stok_aman;
      }

      const produk = removeKeys(element, [
        'id_table',
        'subkategori_id',
        'stock',
      ]);

      return {
        ...produk,
        subkategori: subkategori.nama,
        kategori: subkategori.kategori.nama,
        gudang,
        total_stok,
        total_stok_aman,
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
          stock: {
            select: {
              stok: true,
              stok_aman: true,
              rak: true,
              gudang: {
                select: {
                  nama: true,
                  kode_gudang: true,
                },
              },
            },
          },
          hargaquantity: {
            select: {
              id_table: true,
              harga: true,
              quantity: true,
              keterangan: true,
              produk_id: true,
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
        },
        take: 25,
      });

      return produk.map((item) => {
        const { subkategori, stock } = item;

        const newItem = removeKeys(item, [
          'id_table',
          'subkategori_id',
          'stock',
        ]);

        const gudang = [];
        let total_stok = 0;
        let total_stok_aman = 0;

        for (const item of stock) {
          let status_stok: string = '';

          const { stok, stok_aman, rak } = item;

          const warning = Math.round((stok_aman / 100) * 50);
          const danger = Math.round((stok_aman / 100) * 15);

          if (stok > stok_aman || stok > warning) {
            status_stok += 'aman';
          } else if (stok <= warning && stok > danger) {
            status_stok += 'menipis';
          } else {
            status_stok += 'bahaya';
          }

          gudang.push({ stok, stok_aman, rak, ...item.gudang, status_stok });

          total_stok += item.stok;
          total_stok_aman += item.stok_aman;
        }

        return {
          ...newItem,
          kategori: subkategori.kategori.nama,
          subkategori: subkategori.nama,
          gudang: gudang,
          total_stok,
          total_stok_aman,
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
          stock: {
            select: {
              stok: true,
              stok_aman: true,
              rak: true,
              gudang: {
                select: {
                  nama: true,
                  kode_gudang: true,
                },
              },
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
      const { subkategori, stock } = item;

      const newItem = removeKeys(item, ['id_table', 'subkategori_id', 'stock']);

      const gudang = [];
      let total_stok = 0;
      let total_stok_aman = 0;

      for (const item of stock) {
        let status_stok: string = '';

        const { stok, stok_aman, rak } = item;

        const warning = Math.round((stok_aman / 100) * 50);
        const danger = Math.round((stok_aman / 100) * 15);

        if (stok > stok_aman || stok > warning) {
          status_stok += 'aman';
        } else if (stok <= warning && stok > danger) {
          status_stok += 'menipis';
        } else {
          status_stok += 'bahaya';
        }

        gudang.push({ stok, stok_aman, rak, ...item.gudang, status_stok });

        total_stok += item.stok;
        total_stok_aman += item.stok_aman;
      }

      return {
        ...newItem,
        kategori: subkategori.kategori.nama,
        subkategori: subkategori.nama,
        gudang: gudang,
        total_stok,
        total_stok_aman,
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
    if (body.tipe == 'increment') {
      return this.prisma.stock.updateMany({
        where: {
          produk_id: body.kode_item,
          gudang: {
            nama: body.gudang,
          },
        },
        data: {
          stok: {
            increment: body.stok,
          },
          stok_aman: body.stok_aman,
        },
      });
    }

    if (body.tipe == 'decrement') {
      return this.prisma.stock.updateMany({
        where: {
          produk_id: body.kode_item,
          gudang: {
            nama: body.gudang,
          },
        },
        data: {
          stok: {
            decrement: body.stok,
          },
        },
      });
    }
  }

  async filter(query: ProdukQuery) {
    if (query.kode_gudang) {
      const result = await this.prisma.kategori.findUnique({
        where: {
          id_kategori: parseInt(query.id_kategori),
        },
        include: {
          subkategori: {
            select: {
              nama: true,
              produk: {
                where: {
                  stock: {
                    some: {
                      gudang_id: query.kode_gudang,
                    },
                  },
                },
                include: {
                  stock: {
                    select: {
                      stok: true,
                      stok_aman: true,
                      rak: true,
                      gudang: {
                        select: {
                          kode_gudang: true,
                          nama: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const { nama, subkategori } = result;

      const produk = [];

      for (const item of subkategori) {
        produk.push(
          ...item.produk.map((element) => {
            const newItem = removeKeys(element, [
              'id_table',
              'created_at',
              'updated_at',
            ]);
            const { subkategori_id, stock } = newItem;
            delete element.subkategori_id;

            const filterStock = stock.find(
              (el) => el.gudang.kode_gudang == query.kode_gudang,
            );

            return {
              nama_sub_kategori_produk: item.nama,
              sub_kategori_produk: subkategori_id,
              merk: newItem.merk,
              nama_produk: newItem.nama_produk,
              kode_item: newItem.kode_item,
              nama_produk_asli: newItem.nama_produk_asli,
              kode_supplier: newItem.kode_supplier,
              satuan_kecil: newItem.satuan_kecil,
              satuan_besar: newItem.satuan_besar,
              isi_satuan_besar: newItem.isi_satuan_besar,
              harga_pokok: !newItem.harga_pokok ? 0 : newItem.harga_pokok,
              harga_1: !newItem.harga_1 ? 0 : newItem.harga_1,
              harga_2: !newItem.harga_2 ? 0 : newItem.harga_2,
              harga_3: !newItem.harga_3 ? 0 : newItem.harga_3,
              harga_4: !newItem.harga_4 ? 0 : newItem.harga_4,
              harga_5: !newItem.harga_5 ? 0 : newItem.harga_5,
              harga_6: !newItem.harga_6 ? 0 : newItem.harga_6,
              rak: filterStock.rak,
              stok: filterStock.stok,
              stok_aman: filterStock.stok_aman,
              nama_produk_sebutan: newItem.nama_produk_sebutan,
              konversi: newItem.konversi,
              berat: newItem.berat,
              volume: newItem.volume,
              tipe: newItem.tipe,
              barcode: newItem.barcode,
              kode_pabrik: newItem.kode_pabrik,
              kode_toko: newItem.kode_toko,
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

    const result = await this.prisma.kategori.findUnique({
      where: {
        id_kategori: parseInt(query.id_kategori),
      },
      include: {
        subkategori: {
          include: {
            produk: {
              include: {
                stock: {
                  select: {
                    stok: true,
                    stok_aman: true,
                    rak: true,
                    gudang: {
                      select: {
                        kode_gudang: true,
                        nama: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const { nama, subkategori } = result;

    const produk = [];

    for (const item of subkategori) {
      produk.push(
        ...item.produk.map((element) => {
          const newItem = removeKeys(element, [
            'id_table',
            'created_at',
            'updated_at',
          ]);
          const { subkategori_id } = newItem;
          delete element.subkategori_id;

          return {
            nama_sub_kategori_produk: item.nama,
            sub_kategori_produk: subkategori_id,
            merk: newItem.merk,
            nama_produk: newItem.nama_produk,
            kode_item: newItem.kode_item,
            nama_produk_asli: newItem.nama_produk_asli,
            kode_supplier: newItem.kode_supplier,
            satuan_kecil: newItem.satuan_kecil,
            satuan_besar: newItem.satuan_besar,
            isi_satuan_besar: newItem.isi_satuan_besar,
            harga_pokok: !newItem.harga_pokok ? 0 : newItem.harga_pokok,
            harga_1: !newItem.harga_1 ? 0 : newItem.harga_1,
            harga_2: !newItem.harga_2 ? 0 : newItem.harga_2,
            harga_3: !newItem.harga_3 ? 0 : newItem.harga_3,
            harga_4: !newItem.harga_4 ? 0 : newItem.harga_4,
            harga_5: !newItem.harga_5 ? 0 : newItem.harga_5,
            harga_6: !newItem.harga_6 ? 0 : newItem.harga_6,
            gudang: newItem.stock.map((item) => {
              const { stok, stok_aman, gudang, rak } = item;

              return {
                stok,
                stok_aman,
                rak,
                ...gudang,
              };
            }),
            nama_produk_sebutan: newItem.nama_produk_sebutan,
            konversi: newItem.konversi,
            berat: newItem.berat,
            volume: newItem.volume,
            tipe: newItem.tipe,
            barcode: newItem.barcode,
            kode_pabrik: newItem.kode_pabrik,
            kode_toko: newItem.kode_toko,
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

  async getProdukByGudang(query: ProdukQuery) {
    const result = await this.prisma.stock.findMany({
      where: {
        gudang_id: query.kode_gudang,
      },
      include: {
        produk: {
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
          },
        },
        gudang: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return result.map((item) => {
      const { produk, ...all } = removeKeys(item, [
        'id_table',
        'created_at',
        'updated_at',
        'produk_id',
        'gudang_id',
      ]);

      let status_stok: string = '';

      const { stok, stok_aman } = all;

      const warning = Math.round((stok_aman / 100) * 50);
      const danger = Math.round((stok_aman / 100) * 15);

      if (stok > stok_aman || stok > warning) {
        status_stok += 'aman';
      } else if (stok <= warning && stok > danger) {
        status_stok += 'menipis';
      } else {
        status_stok += 'bahaya';
      }

      return {
        ...removeKeys(produk, ['id_table', 'subkategori_id', 'subkategori']),
        ...all,
        gudang: all.gudang.nama,
        subkategori: produk.subkategori.nama,
        kategori: produk.subkategori.kategori.nama,
        status_stok,
      };
    });
  }
}
