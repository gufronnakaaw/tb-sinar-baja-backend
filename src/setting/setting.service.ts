import { Injectable } from '@nestjs/common';
import { PrismaService } from '../utils/services/prisma.service';

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService) {}

  getSetting() {
    return this.prisma.setting.findUnique({
      where: {
        id_table: 1,
      },
      select: {
        field: true,
      },
    });
  }

  updateSetting(field: string) {
    return this.prisma.setting.update({
      where: {
        id_table: 1,
      },
      data: {
        field,
      },
      select: {
        field: true,
      },
    });
  }
}
