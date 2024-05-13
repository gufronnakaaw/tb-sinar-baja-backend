import { Module } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { KategoriController } from './kategori.controller';
import { KategoriService } from './kategori.service';

@Module({
  controllers: [KategoriController],
  providers: [KategoriService, PrismaService],
})
export class KategoriModule {}
