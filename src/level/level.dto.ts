import { z } from 'zod';

export const createLevelSchema = z.object({
  nama: z.string(),
});

export type CreateLevelDto = z.infer<typeof createLevelSchema>;

export const updateLevelSchema = z.object({
  id_level: z.string(),
  nama: z.string().optional(),
});

export type UpdateLevelDto = z.infer<typeof updateLevelSchema>;
