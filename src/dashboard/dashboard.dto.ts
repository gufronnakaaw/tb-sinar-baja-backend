type DashboardDto = {
  status_stok: string;
  omzet: number;
  laba_kotor: number;
  barang_rusak: number;
  hutang: number;
  estimasi_rugi: number;
  piutang: number;
};

export type OwnerDashboardDto = DashboardDto;
export type AdminDashboardDto = Omit<
  DashboardDto,
  'laba_kotor' | 'estimasi_rugi'
>;

export type CashierDashboardDto = Pick<
  DashboardDto,
  'status_stok' | 'omzet' | 'barang_rusak'
>;
