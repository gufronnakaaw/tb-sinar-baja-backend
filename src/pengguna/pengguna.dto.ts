import { z } from 'zod';

export const createPenggunaSchema = z.object({
  nama: z.string().trim(),
  username: z.string().trim(),
  password: z.string().trim(),
  role: z.string().trim(),
});

export type CreatePenggunaDto = z.infer<typeof createPenggunaSchema>;

export type PenggunaQuery = {
  username: string;
  password_encrypt: string;
};

export const updatePenggunaSchema = z.object({
  username: z.string().trim(),
  nama: z.string().trim().optional(),
  password_old: z.string().trim().optional(),
  password_new: z.string().trim().optional(),
  role: z.string().trim().optional(),
});

export type UpdatePenggunaDto = z.infer<typeof updatePenggunaSchema>;
