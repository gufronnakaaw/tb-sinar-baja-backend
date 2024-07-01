import { z } from 'zod';

export const createReturnSchema = z.object({
  transaksi_id: z.string(),
  id_transaksi_bank: z.string().optional(),
  nama_bank: z.string().optional(),
  atas_nama: z.string().optional(),
  no_rekening: z.string().optional(),
  metode: z.enum(['cash', 'transfer']),
  jumlah: z.number(),
  penalti_keseluruhan: z.number().optional(),
  list_produk: z.array(
    z.object({
      kode_item: z.string(),
      jumlah: z.number(),
      satuan: z.string(),
      nama_produk: z.string(),
      gudang: z.string(),
      rak: z.string(),
      harga: z.number(),
      sub_total: z.number(),
      diskon_langsung_item: z.number(),
      diskon_persen_item: z.number(),
      dikembalikan: z.number(),
      penalti: z.number(),
      total_pengembalian: z.number(),
      diskon_per_item: z.number(),
      harga_setelah_diskon: z.number(),
    }),
  ),
});

export type CreateReturnDto = z.infer<typeof createReturnSchema>;

export type ReturnQuery = {
  id_return: string;
};
