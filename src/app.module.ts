import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { KategoriModule } from './kategori/kategori.module';
import { ProdukModule } from './produk/produk.module';
import { TransaksiModule } from './transaksi/transaksi.module';
import { GudangModule } from './gudang/gudang.module';

@Module({
  imports: [ProdukModule, TransaksiModule, KategoriModule, GudangModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
