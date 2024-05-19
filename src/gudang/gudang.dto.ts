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
