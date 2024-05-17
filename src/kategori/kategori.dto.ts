import { z } from 'zod';

export const createKategoriSchema = z.object({
  nama: z.string().trim(),
});

export type CreateKategoriType = z.infer<typeof createKategoriSchema>;

export const createSubKategoriSchema = z.object({
  id_kategori: z.number().positive(),
  nama: z.string().trim(),
});

export type CreateSubKategoriType = z.infer<typeof createSubKategoriSchema>;

export const updateKategoriSchema = z.object({
  id_kategori: z.number().positive(),
  nama: z.string().trim().optional(),
});

export type UpdateKategoriType = z.infer<typeof updateKategoriSchema>;

export const updateSubKategoriSchema = z.object({
  id_subkategori: z.string(),
  nama: z.string().trim().optional(),
});

export type UpdateSubKategoriType = z.infer<typeof updateSubKategoriSchema>;

export type KategoriQuery = {
  search?: string;
  id?: string;
  page?: number;
  size?: number;
};

export const createBulkSubkategori = z.object({
  id_kategori: z.number(),
  subkategori: z
    .array(
      z.object({
        nama: z.string().trim(),
      }),
    )
    .min(1),
});

export type CreateBulkSubkategoriType = z.infer<typeof createBulkSubkategori>;
