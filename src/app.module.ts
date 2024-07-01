import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DashboardModule } from './dashboard/dashboard.module';
import { GudangModule } from './gudang/gudang.module';
import { KategoriModule } from './kategori/kategori.module';
import { LevelModule } from './level/level.module';
import { MemberModule } from './member/member.module';
import { PenggunaModule } from './pengguna/pengguna.module';
import { ProdukModule } from './produk/produk.module';
import { SettingModule } from './setting/setting.module';
import { SupplierModule } from './supplier/supplier.module';
import { SuratjalanModule } from './suratjalan/suratjalan.module';
import { TransaksiModule } from './transaksi/transaksi.module';
import { PenawaranModule } from './penawaran/penawaran.module';
import { PreorderModule } from './preorder/preorder.module';
import { InvoiceModule } from './invoice/invoice.module';
import { ReturnModule } from './return/return.module';

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
    SettingModule,
    LevelModule,
    MemberModule,
    PenawaranModule,
    PreorderModule,
    InvoiceModule,
    ReturnModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
