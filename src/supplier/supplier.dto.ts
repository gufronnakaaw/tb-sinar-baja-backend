import { z } from 'zod';

export const createSupplierSchema = z.object({
  nama: z.string(),
  email: z.string(),
  no_telp: z.string(),
  alamat_kantor: z.string(),
  alamat_gudang: z.string(),
  keterangan: z.string(),
  bank: z.string(),
  atas_nama: z.string(),
  no_rekening: z.string(),
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
  bank: z.string().optional(),
  atas_nama: z.string().optional(),
  no_rekening: z.string().optional(),
});

export type UpdateSupplierDto = z.infer<typeof updateSupplierSchema>;