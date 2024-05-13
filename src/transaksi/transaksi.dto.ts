import { z } from 'zod';

export const createTransaksiSchema = z.object({
  keterangan: z.string().trim().optional(),
  penerima: z.string().trim().optional(),
  no_telp: z.string().trim().optional(),
  pengiriman: z.string().trim().optional(),
  alamat: z.string().trim().optional(),
  ongkir: z.number().positive().optional(),
  pajak: z.number().positive().optional(),
  persen_pajak: z.number().positive().optional(),
  total_belanja: z.number().positive(),
  total_pembayaran: z.number().positive(),
  tunai: z.number().positive(),
  tipe: z.string().trim().optional(),
  unique_key: z.string().trim().optional(),
  metode: z.string().trim().optional(),
  list_produk: z
    .array(
      z.object({
        kode_item: z.string(),
        jumlah: z.number().positive(),
        satuan: z.string().trim(),
        nama_produk: z.string().trim(),
        harga: z.number().positive(),
        sub_total: z.number().positive(),
      }),
    )
    .min(1),
});

export type CreateTransaksiDto = z.infer<typeof createTransaksiSchema>;
