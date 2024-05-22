import { Module } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { PenggunaController } from './pengguna.controller';
import { PenggunaService } from './pengguna.service';

@Module({
  controllers: [PenggunaController],
  providers: [PenggunaService, PrismaService],
})
export class PenggunaModule {}
