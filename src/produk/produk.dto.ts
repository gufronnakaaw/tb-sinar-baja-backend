import { z } from 'zod';

export type ProdukQuery = {
  search?: string;
  page?: number;
  size?: number;
  kode_item?: string;
  id_subkategori: string;
  kode_gudang: string;
  id_kategori: string;
};

const produk = z.object({
  kode_item: z.string().trim(),
  barcode: z.string().trim().optional().nullable(),
  kode_pabrik: z.string().trim().optional().nullable(),
  kode_toko: z.string().trim().optional().nullable(),
  kode_supplier: z.string().trim().optional().nullable(),
  rak: z.string().trim().optional().nullable(),
  nama_produk: z.string().trim().optional(),
  nama_produk_asli: z.string().optional().nullable(),
  nama_produk_sebutan: z.string().optional().nullable(),
  subkategori_id: z.string().trim().optional(),
  merk: z.string().optional().nullable(),
  tipe: z.string().optional().nullable(),
  satuan_besar: z.string().optional().nullable(),
  satuan_kecil: z.string().optional().nullable(),
  isi_satuan_besar: z.string().optional().nullable(),
  konversi: z.number().optional().nullable(),
  harga_pokok: z.number().optional().nullable(),
  harga_1: z.number().optional().nullable(),
  harga_2: z.number().optional().nullable(),
  harga_3: z.number().optional().nullable(),
  harga_4: z.number().optional().nullable(),
  harga_5: z.number().optional().nullable(),
  harga_6: z.number().optional().nullable(),
  stok: z.number().optional().nullable(),
  stok_aman: z.number().optional().nullable(),
  harga_diskon: z.number().optional().nullable(),
  berat: z.number().optional().nullable(),
  volume: z.number().optional().nullable(),
});

export const createBulkProduk = z.object({
  gudang_id: z.string(),
  produk: z.array(produk).min(1),
});

export type CreateBulkProduk = z.infer<typeof createBulkProduk>;
export type ProdukType = z.infer<typeof produk>;

export const updateProdukSchema = z.object({
  kode_item: z.string().trim(),
  barcode: z.string().trim().optional().nullable(),
  kode_pabrik: z.string().trim().optional().nullable(),
  kode_toko: z.string().trim().optional().nullable(),
  kode_supplier: z.string().trim().optional().nullable(),
  rak: z.string().trim().optional().nullable(),
  nama_produk: z.string().optional(),
  nama_produk_asli: z.string().optional().nullable(),
  nama_produk_sebutan: z.string().optional().nullable(),
  subkategori_id: z.string().optional(),
  merk: z.string().optional().nullable(),
  tipe: z.string().optional().nullable(),
  satuan_besar: z.string().optional().nullable(),
  satuan_kecil: z.string().optional().nullable(),
  isi_satuan_besar: z.string().optional().nullable(),
  konversi: z.number().optional().nullable(),
  harga_pokok: z.number().optional().nullable(),
  harga_1: z.number().optional().nullable(),
  harga_2: z.number().optional().nullable(),
  harga_3: z.number().optional().nullable(),
  harga_4: z.number().optional().nullable(),
  harga_5: z.number().optional().nullable(),
  harga_6: z.number().optional().nullable(),
  harga_diskon: z.number().optional().nullable(),
  berat: z.number().optional().nullable(),
  volume: z.number().optional().nullable(),
});

export type UpdateProdukDto = z.infer<typeof updateProdukSchema>;

export const updateStokProdukSchema = z.object({
  gudang: z.string(),
  kode_item: z.string().trim(),
  stok: z.number().optional(),
  stok_aman: z.number().optional().nullable(),
  tipe: z.enum(['increment', 'decrement']).optional(),
});

export type UpdateStokProdukType = z.infer<typeof updateStokProdukSchema>;
