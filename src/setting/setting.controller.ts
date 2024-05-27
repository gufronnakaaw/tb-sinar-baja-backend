import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { SuccessResponse } from '../utils/global/global.response';
import { SettingService } from './setting.service';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async index(): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.settingService.getSetting(),
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: { field: string }): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.settingService.updateSetting(body.field),
      };
    } catch (error) {
      throw error;
    }
  }
}
