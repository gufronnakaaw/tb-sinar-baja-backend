import { Module } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';
import { LevelController } from './level.controller';
import { LevelService } from './level.service';

@Module({
  controllers: [LevelController],
  providers: [LevelService, PrismaService],
})
export class LevelModule {}
