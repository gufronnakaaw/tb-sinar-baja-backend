import { Module } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { TransaksiController } from './transaksi.controller';
import { TransaksiService } from './transaksi.service';

@Module({
  controllers: [TransaksiController],
  providers: [TransaksiService, PrismaService],
})
export class TransaksiModule {}
