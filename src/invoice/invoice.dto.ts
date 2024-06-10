import { z } from 'zod';

export type InvoiceQuery = {
  id_invoice: string;
};

export const createInvoiceSchema = z.object({
  sumber: z.enum(['non_supplier', 'supplier']),
  bank_id: z.number().optional(),
  preorder_id: z.string(),
  nomor_invoice: z.string(),
  tagihan: z.number(),
  sisa: z.number(),
  jatuh_tempo: z.string(),
  id_transaksi: z.string().optional(),
  nama_bank: z.string().optional(),
  atas_nama: z.string().optional(),
  no_rekening: z.string().optional(),
  tipe: z.enum(['cash', 'transfer']),
  jumlah: z.number().nullable().optional(),
});

export type CreateInvoiceDto = z.infer<typeof createInvoiceSchema>;

export const createInvoicePaymentSchema = z.object({
  sumber: z.enum(['non_supplier', 'supplier']),
  bank_id: z.number().optional(),
  invoice_id: z.string(),
  id_transaksi: z.string().optional(),
  nama_bank: z.string().optional(),
  atas_nama: z.string().optional(),
  no_rekening: z.string().optional(),
  tipe: z.enum(['cash', 'transfer']),
  jumlah: z.number(),
});

export type CreateInvoicePaymentDto = z.infer<
  typeof createInvoicePaymentSchema
>;
