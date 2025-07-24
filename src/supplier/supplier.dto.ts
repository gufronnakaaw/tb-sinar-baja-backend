import { z } from 'zod';

export const createSupplierSchema = z.object({
  nama: z.string(),
  email: z.string(),
  no_telp: z.string(),
  alamat_kantor: z.string(),
  alamat_gudang: z.string(),
  keterangan: z.string(),
  bank: z.array(
    z.object({
      nama: z.string(),
      atas_nama: z.string(),
      no_rekening: z.string(),
    }),
  ),
});

export type CreateSupplierDto = z.infer<typeof createSupplierSchema>;

export const updateSupplierSchema = z.object({
  id_supplier: z.string(),
  nama: z.string().optional(),
  email: z.string().optional(),
  no_telp: z.string().optional(),
  alamat_kantor: z.string().optional(),
  alamat_gudang: z.string().optional(),
  keterangan: z.string().optional(),
});

export type UpdateSupplierDto = z.infer<typeof updateSupplierSchema>;

export type SupplierPricelistQuery = {
  id_supplier: string;
};

export const createBankSchema = z.object({
  id_supplier: z.string(),
  nama: z.string(),
  atas_nama: z.string(),
  no_rekening: z.string(),
});

export type CreateBankDto = z.infer<typeof createBankSchema>;

export const updateBankSchema = z.object({
  bank_id: z.number(),
  nama: z.string().optional(),
  atas_nama: z.string().optional(),
  no_rekening: z.string().optional(),
});

export type UpdateBankDto = z.infer<typeof updateBankSchema>;

export const createSupplierPricelistSchema = z.object({
  supplier_id: z.string(),
  harga: z.number(),
  harga_grosir: z.number(),
  produk_id: z.string(),
});

export type CreateSupplierPricelistDto = z.infer<
  typeof createSupplierPricelistSchema
>;

export const updateSupplierPricelistSchema = z.object({
  supplier_id: z.string(),
  produk_id: z.string().optional(),
  harga: z.number().optional(),
  harga_grosir: z.number().optional(),
});

export type UpdateSupplierPricelistDto = z.infer<
  typeof updateSupplierPricelistSchema
>;
