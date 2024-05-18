import { Module } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { SuratjalanController } from './suratjalan.controller';
import { SuratjalanService } from './suratjalan.service';

@Module({
  controllers: [SuratjalanController],
  providers: [SuratjalanService, PrismaService],
})
export class SuratjalanModule {}
