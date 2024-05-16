import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { SuccessResponse } from '../utils/global/global.response';
import { ZodValidationPipe } from '../utils/pipes/zod.pipe';
import {
  CreateKategoriType,
  CreateSubKategoriType,
  KategoriQuery,
  UpdateKategoriType,
  UpdateSubKategoriType,
  createKategoriSchema,
  createSubKategoriSchema,
  updateKategoriSchema,
  updateSubKategoriSchema,
} from './kategori.dto';
import { KategoriService } from './kategori.service';

@Controller('kategori')
export class KategoriController {
  constructor(private readonly kategoriService: KategoriService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async index(@Query() query: KategoriQuery): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.kategoriService.getKategori(query),
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
      throw error;
    }
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateKategoriSchema))
  async updateKategori(
    @Body() body: UpdateKategoriType,
  ): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.kategoriService.updateKategori(body),
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch('subkategori')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateSubKategoriSchema))
  async updateSubKategori(
    @Body() body: UpdateSubKategoriType,
  ): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.kategoriService.updateSubKategori(body),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
