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
