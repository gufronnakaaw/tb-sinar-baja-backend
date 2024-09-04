import { Module } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { KeuanganController } from './keuangan.controller';
import { KeuanganService } from './keuangan.service';

@Module({
  controllers: [KeuanganController],
  providers: [KeuanganService, PrismaService],
})
export class KeuanganModule {}
