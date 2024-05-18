import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
  UsePipes,
} from '@nestjs/common';
import { SuccessResponse } from '../utils/global/global.response';
import { ZodValidationPipe } from '../utils/pipes/zod.pipe';
import {
  SuratJalanQuery,
  UpdateSuratJalanDto,
  updateSuratJalanSchema,
} from './suratjalan.dto';
import { SuratjalanService } from './suratjalan.service';

@Controller('suratjalan')
export class SuratjalanController {
  constructor(private readonly suratjalanService: SuratjalanService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async index(@Query() query: SuratJalanQuery): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.suratjalanService.getSuratJalan(query),
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateSuratJalanSchema))
  async update(@Body() body: UpdateSuratJalanDto): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.suratjalanService.updateSuratJalan(body),
      };
    } catch (error) {
      throw error;
    }
  }
}
