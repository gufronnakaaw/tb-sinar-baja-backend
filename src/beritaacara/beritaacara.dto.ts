import { z } from 'zod';

export type BeritaAcaraQuery = {
  id_ba: string;
};
export const createBeritaAcaraSchema = z.object({
  list_produk: z
    .array(
      z.object({
        kode_item: z.string(),
        nama_produk: z.string().trim(),
        jumlah: z.number().positive(),
        satuan: z.string().trim(),
        gudang: z.string().trim(),
        rak: z.string().trim().optional(),
        harga: z.number().positive(),
        alasan: z.string().trim(),
        tipe_harga: z.string().trim(),
      }),
    )
    .min(1),
});

export type CreateBeritaAcaraDto = z.infer<typeof createBeritaAcaraSchema>;
