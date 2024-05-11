import { Injectable } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { ProdukQuery } from './produk.dto';

@Injectable()
export class ProdukService {
  constructor(private prisma: PrismaService) {}

  // createProduk() {
  //   return this.prisma.produk.createMany({
  //     data: [
  //       {
  //         kode_item: 'SEA-A300BL',
  //         barcode: null,
  //         kode_pabrik: null,
  //         kode_toko: null,
  //         kode_supplier: null,
  //         nama_produk: 'Sealent Asam Hitam(Black) 300gr',
  //         nama_produk_asli: 'Sealent Asam Hitam(Black) 300gr',
  //         nama_produk_sebutan: null,
  //         subkategori_id: 81,
  //         merk: null,
  //         tipe: null,
  //         satuan_besar: null,
  //         satuan_kecil: 'btl',
  //         isi_satuan_besar: null,
  //         konversi: null,
  //         harga_pokok: 19500,
  //         harga_1: 25994,
  //         harga_2: null,
  //         harga_3: null,
  //         harga_4: null,
  //         harga_5: null,
  //         harga_6: null,
  //       },
  //       {
  //         kode_item: 'SEA-A300LG',
  //         barcode: null,
  //         kode_pabrik: null,
  //         kode_toko: null,
  //         kode_supplier: null,
  //         nama_produk: 'Sealent Asam abu-abu(Light Grey) 300gr',
  //         nama_produk_asli: 'Sealent Asam abu-abu(Light Grey) 300gr',
  //         nama_produk_sebutan: null,
  //         subkategori_id: 81,
  //         merk: null,
  //         tipe: null,
  //         satuan_besar: null,
  //         satuan_kecil: 'btl',
  //         isi_satuan_besar: null,
  //         konversi: null,
  //         harga_pokok: 19500,
  //         harga_1: 25994,
  //         harga_2: null,
  //         harga_3: null,
  //         harga_4: null,
  //         harga_5: null,
  //         harga_6: null,
  //       },
  //       {
  //         kode_item: 'SEA-NA300CL',
  //         barcode: null,
  //         kode_pabrik: null,
  //         kode_toko: null,
  //         kode_supplier: null,
  //         nama_produk: 'Sealent Asam Bening(Clear) 300gr',
  //         nama_produk_asli: 'Sealent Asam Bening(Clear) 300gr',
  //         nama_produk_sebutan: null,
  //         subkategori_id: 81,
  //         merk: null,
  //         tipe: null,
  //         satuan_besar: null,
  //         satuan_kecil: 'btl',
  //         isi_satuan_besar: null,
  //         konversi: null,
  //         harga_pokok: 27000,
  //         harga_1: 35991,
  //         harga_2: null,
  //         harga_3: null,
  //         harga_4: null,
  //         harga_5: null,
  //         harga_6: null,
  //       },
  //       {
  //         kode_item: 'SEA-NA300WH',
  //         barcode: null,
  //         kode_pabrik: null,
  //         kode_toko: null,
  //         kode_supplier: null,
  //         nama_produk: 'Sealent Asam Putih Susu(White) 300gr',
  //         nama_produk_asli: 'Sealent Asam Putih Susu(White) 300gr',
  //         nama_produk_sebutan: null,
  //         subkategori_id: 81,
  //         merk: null,
  //         tipe: null,
  //         satuan_besar: null,
  //         satuan_kecil: 'btl',
  //         isi_satuan_besar: null,
  //         konversi: null,
  //         harga_pokok: 27000,
  //         harga_1: 35991,
  //         harga_2: null,
  //         harga_3: null,
  //         harga_4: null,
  //         harga_5: null,
  //         harga_6: null,
  //       },
  //       {
  //         kode_item: 'SEA-NA300BL',
  //         barcode: null,
  //         kode_pabrik: null,
  //         kode_toko: null,
  //         kode_supplier: null,
  //         nama_produk: 'Sealent Asam Hitam(Black) 300gr',
  //         nama_produk_asli: 'Sealent Asam Hitam(Black) 300gr',
  //         nama_produk_sebutan: null,
  //         subkategori_id: 81,
  //         merk: null,
  //         tipe: null,
  //         satuan_besar: null,
  //         satuan_kecil: 'btl',
  //         isi_satuan_besar: null,
  //         konversi: null,
  //         harga_pokok: 27000,
  //         harga_1: 35991,
  //         harga_2: null,
  //         harga_3: null,
  //         harga_4: null,
  //         harga_5: null,
  //         harga_6: null,
  //       },
  //       {
  //         kode_item: 'SEA-NA300LG',
  //         barcode: null,
  //         kode_pabrik: null,
  //         kode_toko: null,
  //         kode_supplier: null,
  //         nama_produk: 'Sealent Asam abu-abu terang(Light Grey) 300gr',
  //         nama_produk_asli: 'Sealent Asam abu-abu terang(Light Grey) 300gr',
  //         nama_produk_sebutan: null,
  //         subkategori_id: 81,
  //         merk: null,
  //         tipe: null,
  //         satuan_besar: null,
  //         satuan_kecil: 'btl',
  //         isi_satuan_besar: null,
  //         konversi: null,
  //         harga_pokok: 27000,
  //         harga_1: 35991,
  //         harga_2: null,
  //         harga_3: null,
  //         harga_4: null,
  //         harga_5: null,
  //         harga_6: null,
  //       },
  //       {
  //         kode_item: 'SEA-NA300DG',
  //         barcode: null,
  //         kode_pabrik: null,
  //         kode_toko: null,
  //         kode_supplier: null,
  //         nama_produk: 'Sealent Asam Abu-abu gelap(Grey) 300gr',
  //         nama_produk_asli: 'Sealent Asam Abu-abu gelap(Grey) 300gr',
  //         nama_produk_sebutan: null,
  //         subkategori_id: 81,
  //         merk: null,
  //         tipe: null,
  //         satuan_besar: null,
  //         satuan_kecil: 'btl',
  //         isi_satuan_besar: null,
  //         konversi: null,
  //         harga_pokok: 27000,
  //         harga_1: 35991,
  //         harga_2: null,
  //         harga_3: null,
  //         harga_4: null,
  //         harga_5: null,
  //         harga_6: null,
  //       },
  //       {
  //         kode_item: 'SEA-NA300AG',
  //         barcode: null,
  //         kode_pabrik: null,
  //         kode_toko: null,
  //         kode_supplier: null,
  //         nama_produk: 'Sealent Asam Aluminium Grey 300gr',
  //         nama_produk_asli: 'Sealent Asam Aluminium Grey 300gr',
  //         nama_produk_sebutan: null,
  //         subkategori_id: 81,
  //         merk: null,
  //         tipe: null,
  //         satuan_besar: null,
  //         satuan_kecil: 'btl',
  //         isi_satuan_besar: null,
  //         konversi: null,
  //         harga_pokok: 27000,
  //         harga_1: 35991,
  //         harga_2: null,
  //         harga_3: null,
  //         harga_4: null,
  //         harga_5: null,
  //         harga_6: null,
  //       },
  //     ],
  //   });
  // }

  async getProduk({ search, ...props }: ProdukQuery) {
    const defaultPage = 1;
    const defaultSize = 10;

    const page = parseInt(props.page) ? parseInt(props.page) : defaultPage;
    const size = parseInt(props.size) ? parseInt(props.size) : defaultSize;

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
        },
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
      total_produk: totalProduk,
      total_page: Math.ceil(totalProduk / size),
    };
  }
}
