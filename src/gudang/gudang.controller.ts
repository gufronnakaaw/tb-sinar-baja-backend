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
  CreateEntryDto,
  CreateGudangDto,
  UpdateGudangDto,
  updateGudangSchema,
} from './gudang.dto';
import { GudangService } from './gudang.service';

@Controller('gudang')
export class GudangController {
  constructor(private readonly gudangService: GudangService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async index(): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.gudangService.getGudang(),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async store(@Body() body: CreateGudangDto): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.gudangService.createGudang(body),
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateGudangSchema))
  async update(@Body() body: UpdateGudangDto): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.gudangService.updateGudang(body),
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':kode_gudang')
  @HttpCode(HttpStatus.OK)
  async destroy(
    @Param('kode_gudang') kode_gudang: string,
  ): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.gudangService.deleteGudang(kode_gudang),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('entry')
  @HttpCode(HttpStatus.OK)
  async indexEntry(): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.gudangService.getEntry(),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('entry')
  @HttpCode(HttpStatus.CREATED)
  async storeEntry(@Body() body: CreateEntryDto): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.gudangService.createEntry(body),
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch('stok')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateGudangSchema))
  async updateStok(@Body() body: UpdateGudangDto): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.gudangService.updateGudang(body),
      };
    } catch (error) {
      throw error;
    }
  }
}
