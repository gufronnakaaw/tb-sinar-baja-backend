import { Module } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { ProdukController } from './produk.controller';
import { ProdukService } from './produk.service';

@Module({
  controllers: [ProdukController],
  providers: [ProdukService, PrismaService],
})
export class ProdukModule {}
