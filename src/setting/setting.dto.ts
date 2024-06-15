import { z } from 'zod';

export const createPriceQuantitySchema = z.object({
  produk_id: z.string(),
  harga: z.number(),
  quantity: z.number(),
  keterangan: z.string().optional(),
});

export type CreatePriceQuantityDto = z.infer<typeof createPriceQuantitySchema>;

export const updatePriceQuantitySchema = z.object({
  id_table: z.number(),
  harga: z.number().optional(),
  quantity: z.number().optional(),
  keterangan: z.string().optional(),
});

export type UpdatePriceQuantityDto = z.infer<typeof updatePriceQuantitySchema>;
