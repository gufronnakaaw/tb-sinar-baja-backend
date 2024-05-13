import { Module } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { GudangController } from './gudang.controller';
import { GudangService } from './gudang.service';

@Module({
  controllers: [GudangController],
  providers: [GudangService, PrismaService],
})
export class GudangModule {}
