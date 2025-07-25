import { z } from 'zod';
export type TransaksiQuery = {
  id: string;
  search: string;
  role: string;
};

export const createTransaksiSchema = z.object({
  keterangan: z.string().trim().optional(),
  penerima: z.string().trim().optional(),
  no_telp: z.string().trim().optional(),
  pengiriman: z.string().trim().optional(),
  alamat: z.string().trim().optional(),
  ongkir: z.number().positive().optional().nullable(),
  pajak: z.number().positive().optional().nullable(),
  persen_pajak: z.number().positive().optional().nullable(),
  diskon: z.number().positive().optional().nullable(),
  persen_diskon: z.number().positive().optional().nullable(),
  total_belanja: z.number().positive(),
  total_pembayaran: z.number().positive(),
  tunai: z.number(),
  kembalian: z.number(),
  tipe: z.string().trim().optional(),
  unique_key: z.string().trim().optional(),
  metode: z.string().trim().optional(),
  asal_transaksi: z.string().optional(),
  nama_bank: z.string().optional(),
  atas_nama: z.string().optional(),
  no_rekening: z.string().optional(),
  id_transaksi_bank: z.string().optional(),
  status: z.string().optional(),
  dp: z.number().optional(),
  estimasi: z.string().optional(),
  list_produk: z
    .array(
      z.object({
        kode_item: z.string(),
        jumlah: z.number().positive(),
        satuan: z.string().trim(),
        nama_produk: z.string().trim(),
        gudang: z.string().trim(),
        rak: z.string().trim(),
        harga: z.number().positive(),
        sub_total: z.number().positive(),
        diskon_langsung_item: z.number().optional(),
        diskon_persen_item: z.number().optional(),
      }),
    )
    .min(1),
});

export type CreateTransaksiDto = z.infer<typeof createTransaksiSchema>;

export const updateTransaksiSchema = z.object({
  id_transaksi: z.string(),
  keterangan: z.string().trim().optional(),
  penerima: z.string().trim().optional(),
  no_telp: z.string().trim().optional(),
  pengiriman: z.string().trim().optional(),
  alamat: z.string().trim().optional(),
  ongkir: z.number().positive().optional().nullable(),
  pajak: z.number().positive().optional().nullable(),
  persen_pajak: z.number().positive().optional().nullable(),
  diskon: z.number().positive().optional().nullable(),
  persen_diskon: z.number().positive().optional().nullable(),
  total_belanja: z.number().positive().optional(),
  total_pembayaran: z.number().positive().optional(),
  tunai: z.number().optional(),
  kembalian: z.number().optional(),
  tipe: z.string().trim().optional(),
  unique_key: z.string().trim().optional(),
  metode: z.string().trim().optional(),
  asal_transaksi: z.string().optional(),
  nama_bank: z.string().optional(),
  atas_nama: z.string().optional(),
  no_rekening: z.string().optional(),
  id_transaksi_bank: z.string().optional(),
  status: z.string().optional(),
  dp: z.number().optional(),
  estimasi: z.string().optional(),
  list_produk: z
    .array(
      z.object({
        kode_item: z.string(),
        jumlah: z.number().positive().optional(),
        satuan: z.string().trim().optional(),
        nama_produk: z.string().trim().optional(),
        gudang: z.string().trim().optional(),
        rak: z.string().trim().optional(),
        harga: z.number().positive().optional(),
        sub_total: z.number().positive().optional(),
        diskon_langsung_item: z.number().optional(),
        diskon_persen_item: z.number().optional(),
      }),
    )
    .min(1)
    .optional(),
});

export type UpdateTransaksiDto = z.infer<typeof updateTransaksiSchema>;

export const updateStateSchema = z.object({
  transaksi_id: z.string(),
  state: z.enum(['success', 'cancelled']),
});

export type UpdateStateDto = z.infer<typeof updateStateSchema>;
