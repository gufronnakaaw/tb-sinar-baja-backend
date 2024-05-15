import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DashboardModule } from './dashboard/dashboard.module';
import { GudangModule } from './gudang/gudang.module';
import { KategoriModule } from './kategori/kategori.module';
import { ProdukModule } from './produk/produk.module';
import { TransaksiModule } from './transaksi/transaksi.module';

@Module({
  imports: [
    ProdukModule,
    TransaksiModule,
    KategoriModule,
    GudangModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
