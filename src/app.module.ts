import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DashboardModule } from './dashboard/dashboard.module';
import { GudangModule } from './gudang/gudang.module';
import { KategoriModule } from './kategori/kategori.module';
import { PenggunaModule } from './pengguna/pengguna.module';
import { ProdukModule } from './produk/produk.module';
import { SuratjalanModule } from './suratjalan/suratjalan.module';
import { TransaksiModule } from './transaksi/transaksi.module';
import { SupplierModule } from './supplier/supplier.module';

@Module({
  imports: [
    ProdukModule,
    TransaksiModule,
    KategoriModule,
    GudangModule,
    DashboardModule,
    SuratjalanModule,
    PenggunaModule,
    SupplierModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
