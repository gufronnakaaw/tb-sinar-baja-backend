import { z } from 'zod';

export const createGudangSchema = z.object({
  kode_gudang: z.string(),
  nama: z.string(),
});

export type CreateGudangDto = z.infer<typeof createGudangSchema>;

export const updateGudangSchema = z.object({
  kode_gudang: z.string(),
  nama: z.string().optional(),
});

export type UpdateGudangDto = z.infer<typeof updateGudangSchema>;

export const createEntrySchema = z.object({
  preorder_id: z.string(),
  produk_baik: z
    .array(
      z.object({
        kode_item: z.string(),
        nama_produk: z.string().trim(),
        jumlah_entry: z.number().positive(),
      }),
    )
    .min(1),
  produk_rusak: z.array(
    z.object({
      kode_item: z.string(),
      nama_produk: z.string().trim(),
      jumlah_rusak: z.number().positive(),
      satuan_rusak: z.string(),
    }),
  ),
});

export type CreateEntryDto = z.infer<typeof createEntrySchema>;

export const updateStokGudang = z.object({
  list_produk: z
    .array(
      z.object({
        kode_item: z.string(),
        nama_produk: z.string().trim(),
        jumlah: z.number().positive(),
        gudang: z.string(),
      }),
    )
    .min(1),
});
