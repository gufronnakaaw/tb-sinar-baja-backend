import { z } from 'zod';

export const createMemberSchema = z.object({
  level_id: z.string(),
  nama: z.string(),
  perusahaan: z.string().optional(),
  alamat: z.string().optional(),
  email: z.string().optional(),
  no_telp: z.string().optional(),
});

export type CreateMemberDto = z.infer<typeof createMemberSchema>;

export const updateMemberSchema = z.object({
  id_member: z.string(),
  level_id: z.string().optional(),
  nama: z.string().optional(),
  perusahaan: z.string().optional(),
  alamat: z.string().optional(),
  email: z.string().optional(),
  no_telp: z.string().optional(),
});

export type UpdateMemberDto = z.infer<typeof updateMemberSchema>;
