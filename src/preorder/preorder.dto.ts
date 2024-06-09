import { z } from 'zod';

export type PreorderQuery = {
  id_preorder: string;
};

export const createPreorderSchema = z.object({
  supplier_id: z.string().trim().optional().nullable(),
  nama_supplier: z.string().trim().optional().nullable(),
  email_supplier: z.string().trim().optional().nullable(),
  no_telp: z.string().trim().optional().nullable(),
  alamat: z.string().trim().optional().nullable(),
  keterangan: z.string().trim().optional().nullable(),
  tipe: z.string(),
  total: z.number(),
  produk: z.array(
    z.object({
      kode_item: z.string(),
      kode_pabrik: z.string().optional().nullable(),
      nama_produk: z.string(),
      qty: z.number().min(1),
      satuan: z.string(),
      harga: z.number(),
      subharga: z.number(),
      jumlah: z.number(),
    }),
  ),
});

export type CreatePreorderDto = z.infer<typeof createPreorderSchema>;
