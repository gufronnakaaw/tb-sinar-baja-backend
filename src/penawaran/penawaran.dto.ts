import { z } from 'zod';

export type PenawaranQuery = {
  id_penawaran: string;
};

export const createPenawaranSchema = z.object({
  supplier_id: z.string().trim(),
  produk: z.array(
    z.object({
      kode_item: z.string(),
      kode_pabrik: z.string().optional().nullable(),
      nama_produk: z.string(),
      qty: z.number().min(1),
      satuan: z.string(),
      harga: z.number().min(0).optional().nullable(),
      jumlah: z.number().min(0).optional().nullable(),
    }),
  ),
});

export type CreatePenawaranDto = z.infer<typeof createPenawaranSchema>;

export const updateStatusPenawaranSchema = z.object({
  id_penawaran: z.string(),
  status: z.string().optional(),
});

export type UpdateStatusPenawaranDto = z.infer<
  typeof updateStatusPenawaranSchema
>;
