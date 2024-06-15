import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { SuccessResponse } from '../utils/global/global.response';
import { ZodValidationPipe } from '../utils/pipes/zod.pipe';
import {
  CreatePriceQuantityDto,
  UpdatePriceQuantityDto,
  createPriceQuantitySchema,
  updatePriceQuantitySchema,
} from './setting.dto';
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

  @Get('/pricequantity')
  @HttpCode(HttpStatus.OK)
  async getPriceQuantity(): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.settingService.getHargaQuantity(),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/pricequantity')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createPriceQuantitySchema))
  async createPriceQuantity(
    @Body() body: CreatePriceQuantityDto,
  ): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.CREATED,
        data: await this.settingService.createPriceQuantity(body),
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch('/pricequantity')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updatePriceQuantitySchema))
  async updatePriceQuantity(
    @Body() body: UpdatePriceQuantityDto,
  ): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.settingService.updatePriceQuantity(body),
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete('/pricequantity/:id')
  @HttpCode(HttpStatus.OK)
  async destroyPriceQuantity(
    @Param('id') id: string,
  ): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.settingService.destroyPriceQuantity(parseInt(id)),
      };
    } catch (error) {
      throw error;
    }
  }
}
