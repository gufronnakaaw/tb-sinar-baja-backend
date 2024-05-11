import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProdukModule } from './produk/produk.module';

@Module({
  imports: [ProdukModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
