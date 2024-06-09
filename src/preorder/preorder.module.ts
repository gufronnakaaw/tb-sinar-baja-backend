import { Module } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { PreorderController } from './preorder.controller';
import { PreorderService } from './preorder.service';

@Module({
  controllers: [PreorderController],
  providers: [PreorderService, PrismaService],
})
export class PreorderModule {}
