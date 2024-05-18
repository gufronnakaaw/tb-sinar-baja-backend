import { z } from 'zod';

export type SuratJalanQuery = {
  id: string;
};

export const updateSuratJalanSchema = z.object({
  id_suratjalan: z.string(),
  nama_driver: z.string().trim().optional(),
  kendaraan: z.string().trim().optional(),
  plat_kendaraan: z.string().trim().optional(),
  verifikasi: z.boolean().optional(),
});

export type UpdateSuratJalanDto = z.infer<typeof updateSuratJalanSchema>;
