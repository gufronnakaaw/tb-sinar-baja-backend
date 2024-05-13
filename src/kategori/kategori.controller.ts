import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { SuccessResponse } from '../utils/global/global.response';
import { ZodValidationPipe } from '../utils/pipes/zod.pipe';
import {
  CreateKategoriType,
  CreateSubKategoriType,
  createKategoriSchema,
  createSubKategoriSchema,
} from './kategori.dto';
import { KategoriService } from './kategori.service';

@Controller('kategori')
export class KategoriController {
  constructor(private readonly kategoriService: KategoriService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async index(): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: {
          kategori: await this.kategoriService.getKategori(),
          subkategori: await this.kategoriService.getSubKategori(),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createKategoriSchema))
  async createKategori(
    @Body() body: CreateKategoriType,
  ): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.CREATED,
        data: await this.kategoriService.createKategori(body),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('subkategori')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createSubKategoriSchema))
  async createSubKategori(
    @Body() body: CreateSubKategoriType,
  ): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.CREATED,
        data: await this.kategoriService.createSubKategori(body),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
