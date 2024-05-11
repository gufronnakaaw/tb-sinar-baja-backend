import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProdukModule } from './produk/produk.module';
import { TransaksiModule } from './transaksi/transaksi.module';

@Module({
  imports: [ProdukModule, TransaksiModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
