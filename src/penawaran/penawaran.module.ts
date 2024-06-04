import { Module } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { PenawaranController } from './penawaran.controller';
import { PenawaranService } from './penawaran.service';

@Module({
  controllers: [PenawaranController],
  providers: [PenawaranService, PrismaService],
})
export class PenawaranModule {}
