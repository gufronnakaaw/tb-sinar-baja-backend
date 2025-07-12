import { Injectable, NotFoundException } from '@nestjs/common';
import { generateID } from 'src/utils/generate.util';
import { PrismaService } from '../utils/services/prisma.service';
import {
  CreateTransaksiDto,
  TransaksiQuery,
  UpdateStateDto,
} from './transaksi.dto';

@Injectable()
export class TransaksiService {
  constructor(private prisma: PrismaService) {}

  async getTransaksi(query: TransaksiQuery) {
    if (query.search) {
      const results = await this.prisma.transaksi.findMany({
        where: {
          OR: [
            {
              id_transaksi: {
                contains: query.search,
              },
            },
            {
              penerima: {
                contains: query.search,
              },
            },
          ],
        },
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
      });

      return results.map((transaksi) => {
        delete transaksi.id_table;

        const { transaksidetail, ...result } = transaksi;
        delete transaksi.transaksidetail;

        return {
          ...result,
          list_produk: transaksidetail,
        };
      });
    }

    if (query.role == 'all') {
      const results = await this.prisma.transaksi.findMany({
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
        orderBy: {
          created_at: 'desc',
        },
      });

      return results.map((transaksi) => {
        delete transaksi.id_table;

        const { transaksidetail, ...result } = transaksi;
        delete transaksi.transaksidetail;

        return {
          ...result,
          list_produk: transaksidetail,
        };
      });
    }

    const results = await this.prisma.transaksi.findMany({
      where: {
        asal_transaksi: query.role == 'admin' ? 'admin' : 'kasir',
      },
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
      orderBy: {
        created_at: 'desc',
      },
    });

    return results.map((transaksi) => {
      delete transaksi.id_table;

      const { transaksidetail, ...result } = transaksi;
      delete transaksi.transaksidetail;

      return {
        ...result,
        list_produk: transaksidetail,
      };
    });
  }

  async getTransaksiById(id: string) {
    const result = await this.prisma.transaksi.findFirst({
      where: {
        id_transaksi: id,
      },
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
    });

    if (!result) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    delete result.id_table;

    const { transaksidetail, ...results } = result;
    delete result.transaksidetail;

    return {
      ...results,
      list_produk: transaksidetail,
    };
  }

  async createTransaksi(body: CreateTransaksiDto) {
    const check = await this.prisma.transaksi.findMany({
      where: {
        unique_key: body.unique_key,
      },
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
    });

    if (check.length > 0) {
      delete check[0].id_table;

      const { transaksidetail, ...results } = check[0];
      delete check[0].transaksidetail;

      const result = {
        ...results,
        list_produk: transaksidetail,
      };

      return result;
    }

    const date = new Date();

    const data = [];

    for (const produk of body.list_produk) {
      const [stock, ,] = await this.prisma.$transaction([
        this.prisma.stock.findMany({
          select: {
            rak: true,
          },
          where: {
            produk_id: produk.kode_item,
            gudang: {
              nama: produk.gudang,
            },
          },
        }),
        this.prisma.stock.updateMany({
          where: {
            produk_id: produk.kode_item,
            gudang: {
              nama: produk.gudang,
            },
          },
          data: {
            stok: {
              decrement: produk.jumlah,
            },
          },
        }),
      ]);

      data.push({
        diskon_langsung_item: produk.diskon_langsung_item,
        diskon_persen_item: produk.diskon_persen_item,
        jumlah: produk.jumlah,
        satuan: produk.satuan,
        kode_item: produk.kode_item,
        nama_produk: produk.nama_produk,
        gudang: produk.gudang,
        rak: stock[0].rak,
        harga: produk.harga,
        sub_total: produk.sub_total,
      });
    }

    if (body.asal_transaksi == 'admin') {
      if (body.metode == 'tempo') {
        if (body.dp) {
          const [result] = await this.prisma.$transaction([
            this.prisma.transaksi.create({
              data: {
                id_transaksi: generateID('TX', date),
                keterangan: body.keterangan,
                penerima: body.penerima,
                no_telp: body.no_telp,
                pengiriman: body.pengiriman,
                alamat: body.alamat,
                ongkir: body.ongkir,
                pajak: body.pajak,
                persen_pajak: body.persen_pajak,
                diskon: body.diskon,
                persen_diskon: body.persen_diskon,
                total_belanja: body.total_belanja,
                total_pembayaran: body.total_pembayaran,
                tunai: body.tunai,
                kembalian: body.kembalian,
                tipe: body.tipe,
                unique_key: body.unique_key,
                metode: body.metode,
                asal_transaksi: body.asal_transaksi,
                nama_bank: body.nama_bank,
                atas_nama: body.atas_nama,
                no_rekening: body.no_rekening,
                id_transaksi_bank: body.id_transaksi_bank,
                status: body.status,
                dp: null,
                pembayaran: null,
                estimasi: body.estimasi,
                transaksidetail: {
                  createMany: {
                    data,
                  },
                },
                suratjalan: {
                  create: {
                    id_suratjalan: generateID('SJ', date),
                  },
                },
                invoicekeluar: {
                  create: {
                    id_invoice: generateID('INVOUT', date),
                    dp: body.dp,
                    tagihan: body.total_pembayaran,
                    sisa: body.total_pembayaran - body.dp,
                    invoicekeluardetail: {
                      create: {
                        jumlah: body.dp,
                        tipe: 'cash',
                        created_at: date,
                        updated_at: date,
                      },
                    },
                  },
                },
                created_at: date,
                updated_at: date,
              },
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
            }),
          ]);

          delete result.id_table;

          const { transaksidetail, ...results } = result;
          delete result.transaksidetail;

          return {
            ...results,
            list_produk: transaksidetail,
          };
        } else {
          const [result] = await this.prisma.$transaction([
            this.prisma.transaksi.create({
              data: {
                id_transaksi: generateID('TX', date),
                keterangan: body.keterangan,
                penerima: body.penerima,
                no_telp: body.no_telp,
                pengiriman: body.pengiriman,
                alamat: body.alamat,
                ongkir: body.ongkir,
                pajak: body.pajak,
                persen_pajak: body.persen_pajak,
                diskon: body.diskon,
                persen_diskon: body.persen_diskon,
                total_belanja: body.total_belanja,
                total_pembayaran: body.total_pembayaran,
                tunai: body.tunai,
                kembalian: body.kembalian,
                tipe: body.tipe,
                unique_key: body.unique_key,
                metode: body.metode,
                asal_transaksi: body.asal_transaksi,
                nama_bank: body.nama_bank,
                atas_nama: body.atas_nama,
                no_rekening: body.no_rekening,
                id_transaksi_bank: body.id_transaksi_bank,
                status: body.status,
                dp: null,
                pembayaran: null,
                estimasi: body.estimasi,
                transaksidetail: {
                  createMany: {
                    data,
                  },
                },
                suratjalan: {
                  create: {
                    id_suratjalan: generateID('SJ', date),
                  },
                },
                invoicekeluar: {
                  create: {
                    id_invoice: generateID('INVOUT', date),
                    dp: body.dp,
                    tagihan: body.total_pembayaran,
                    sisa: body.total_pembayaran - body.dp,
                  },
                },
                created_at: date,
                updated_at: date,
              },
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
            }),
          ]);

          delete result.id_table;

          const { transaksidetail, ...results } = result;
          delete result.transaksidetail;

          return {
            ...results,
            list_produk: transaksidetail,
          };
        }
      } else {
        const [result] = await this.prisma.$transaction([
          this.prisma.transaksi.create({
            data: {
              id_transaksi: generateID('TX', date),
              keterangan: body.keterangan,
              penerima: body.penerima,
              no_telp: body.no_telp,
              pengiriman: body.pengiriman,
              alamat: body.alamat,
              ongkir: body.ongkir,
              pajak: body.pajak,
              persen_pajak: body.persen_pajak,
              diskon: body.diskon,
              persen_diskon: body.persen_diskon,
              total_belanja: body.total_belanja,
              total_pembayaran: body.total_pembayaran,
              tunai: body.tunai,
              kembalian: body.kembalian,
              tipe: body.tipe,
              unique_key: body.unique_key,
              metode: body.metode,
              asal_transaksi: body.asal_transaksi,
              nama_bank: body.nama_bank,
              atas_nama: body.atas_nama,
              no_rekening: body.no_rekening,
              id_transaksi_bank: body.id_transaksi_bank,
              status: body.status,
              dp: null,
              pembayaran: null,
              estimasi: body.estimasi,
              transaksidetail: {
                createMany: {
                  data,
                },
              },
              suratjalan: {
                create: {
                  id_suratjalan: generateID('SJ', date),
                },
              },
              invoicekeluar: {
                create: {
                  id_invoice: generateID('INVOUT', date),
                  dp: 0,
                  tagihan: body.total_pembayaran,
                  sisa: 0,
                },
              },
              created_at: date,
              updated_at: date,
            },
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
          }),
        ]);

        delete result.id_table;

        const { transaksidetail, ...results } = result;
        delete result.transaksidetail;

        return {
          ...results,
          list_produk: transaksidetail,
        };
      }
    }

    const [result] = await this.prisma.$transaction([
      this.prisma.transaksi.create({
        data: {
          id_transaksi: generateID('TX', date),
          keterangan: body.keterangan,
          penerima: body.penerima,
          no_telp: body.no_telp,
          pengiriman: body.pengiriman,
          alamat: body.alamat,
          ongkir: body.ongkir,
          pajak: body.pajak,
          persen_pajak: body.persen_pajak,
          diskon: body.diskon,
          persen_diskon: body.persen_diskon,
          total_belanja: body.total_belanja,
          total_pembayaran: body.total_pembayaran,
          tunai: body.tunai,
          kembalian: body.kembalian,
          tipe: body.tipe,
          unique_key: body.unique_key,
          metode: body.metode,
          asal_transaksi: body.asal_transaksi,
          nama_bank: body.nama_bank,
          atas_nama: body.atas_nama,
          no_rekening: body.no_rekening,
          id_transaksi_bank: body.id_transaksi_bank,
          status: body.status,
          dp: null,
          pembayaran: null,
          estimasi: body.estimasi,
          transaksidetail: {
            createMany: {
              data,
            },
          },
          suratjalan: {
            create: {
              id_suratjalan: generateID('SJ', date),
            },
          },
          created_at: date,
          updated_at: date,
        },
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
      }),
    ]);

    delete result.id_table;

    const { transaksidetail, ...results } = result;
    delete result.transaksidetail;

    return {
      ...results,
      list_produk: transaksidetail,
    };
  }

  // async updateTransaksi(body: UpdateTransaksiDto) {
  //   const transaksi = await this.prisma.transaksi.findUnique({
  //     where: { id_transaksi: body.id_transaksi },
  //     include: {
  //       transaksidetail: true,
  //     },
  //   });
  //   if (!transaksi) {
  //     throw new NotFoundException('Transaksi tidak ditemukan');
  //   }

  //   for (const detail of transaksi.transaksidetail) {
  //     await this.prisma.stock.updateMany({
  //       where: {
  //         produk_id: detail.kode_item,
  //         gudang: { nama: detail.gudang },
  //       },
  //       data: {
  //         stok: { increment: detail.jumlah },
  //       },
  //     });
  //   }

  //   await this.prisma.transaksiDetail.deleteMany({
  //     where: { transaksi_id: body.id_transaksi },
  //   });

  //   const newDetails = [];
  //   for (const produk of body.list_produk) {
  //     const [stock] = await this.prisma.$transaction([
  //       this.prisma.stock.findMany({
  //         select: { rak: true },
  //         where: {
  //           produk_id: produk.kode_item,
  //           gudang: { nama: produk.gudang },
  //         },
  //       }),
  //       this.prisma.stock.updateMany({
  //         where: {
  //           produk_id: produk.kode_item,
  //           gudang: { nama: produk.gudang },
  //         },
  //         data: {
  //           stok: { decrement: produk.jumlah },
  //         },
  //       }),
  //     ]);
  //     newDetails.push({
  //       diskon_langsung_item: produk.diskon_langsung_item,
  //       diskon_persen_item: produk.diskon_persen_item,
  //       jumlah: produk.jumlah,
  //       satuan: produk.satuan,
  //       kode_item: produk.kode_item,
  //       nama_produk: produk.nama_produk,
  //       gudang: produk.gudang,
  //       rak: stock[0]?.rak ?? null,
  //       harga: produk.harga,
  //       sub_total: produk.sub_total,
  //     });
  //   }

  //   const date = new Date();
  //   const updated = await this.prisma.transaksi.update({
  //     where: { id_transaksi: body.id_transaksi },
  //     data: {
  //       keterangan: body.keterangan,
  //       penerima: body.penerima,
  //       no_telp: body.no_telp,
  //       pengiriman: body.pengiriman,
  //       alamat: body.alamat,
  //       ongkir: body.ongkir,
  //       pajak: body.pajak,
  //       persen_pajak: body.persen_pajak,
  //       diskon: body.diskon,
  //       persen_diskon: body.persen_diskon,
  //       total_belanja: body.total_belanja,
  //       total_pembayaran: body.total_pembayaran,
  //       tunai: body.tunai,
  //       kembalian: body.kembalian,
  //       tipe: body.tipe,
  //       metode: body.metode,
  //       asal_transaksi: body.asal_transaksi,
  //       nama_bank: body.nama_bank,
  //       atas_nama: body.atas_nama,
  //       no_rekening: body.no_rekening,
  //       id_transaksi_bank: body.id_transaksi_bank,
  //       status: body.status,
  //       dp: body.dp ?? null,
  //       pembayaran: body.pembayaran ?? null,
  //       estimasi: body.estimasi,
  //       updated_at: date,
  //       transaksidetail: {
  //         createMany: { data: newDetails },
  //       },
  //     },
  //     include: {
  //       transaksidetail: {
  //         select: {
  //           kode_item: true,
  //           jumlah: true,
  //           satuan: true,
  //           nama_produk: true,
  //           harga: true,
  //           gudang: true,
  //           rak: true,
  //           sub_total: true,
  //           diskon_langsung_item: true,
  //           diskon_persen_item: true,
  //         },
  //       },
  //     },
  //   });

  //   delete updated.id_table;
  //   const { transaksidetail, ...results } = updated;
  //   delete updated.transaksidetail;

  //   return {
  //     ...results,
  //     list_produk: transaksidetail,
  //   };
  // }

  async updateTransaksiState(body: UpdateStateDto) {
    if (
      !(await this.prisma.transaksi.count({
        where: { id_transaksi: body.transaksi_id },
      }))
    ) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    return this.prisma.transaksi.update({
      where: { id_transaksi: body.transaksi_id },
      data: { state: body.state },
    });
  }

  async deleteTransaksi(transaksi_id: string) {
    if (
      !(await this.prisma.transaksi.count({
        where: { id_transaksi: transaksi_id },
      }))
    ) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    return this.prisma.transaksi.delete({
      where: { id_transaksi: transaksi_id },
    });
  }
}
