import { Module } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { BeritaacaraController } from './beritaacara.controller';
import { BeritaacaraService } from './beritaacara.service';

@Module({
  controllers: [BeritaacaraController],
  providers: [BeritaacaraService, PrismaService],
})
export class BeritaacaraModule {}
