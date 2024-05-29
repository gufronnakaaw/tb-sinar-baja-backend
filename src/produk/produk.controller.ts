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
  CreateBulkProduk,
  ProdukQuery,
  UpdateProdukDto,
  UpdateStokProdukType,
  createBulkProduk,
  updateProdukSchema,
  updateStokProdukSchema,
} from './produk.dto';
import { ProdukService } from './produk.service';

@Controller('produk')
export class ProdukController {
  constructor(private readonly produkService: ProdukService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async index(@Query() query: ProdukQuery): Promise<SuccessResponse> {
    try {
      if (query.kode_item) {
        const data = await this.produkService.getProdukByKodeItem(
          query.kode_item,
        );
        return {
          success: true,
          status_code: HttpStatus.OK,
          data,
        };
      }

      if (query.id_subkategori) {
        const data = await this.produkService.getProdukBySubkategori(
          query.id_subkategori,
        );
        return {
          success: true,
          status_code: HttpStatus.OK,
          data,
        };
      }

      const data = await this.produkService.getProduk(query);
      return {
        success: true,
        status_code: HttpStatus.OK,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('export')
  @HttpCode(HttpStatus.OK)
  async export(
    @Query() query: { id_kategori: string },
  ): Promise<SuccessResponse> {
    try {
      const data = await this.produkService.export(parseInt(query.id_kategori));
      return {
        success: true,
        status_code: HttpStatus.OK,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('bulk')
  @UsePipes(new ZodValidationPipe(createBulkProduk))
  @HttpCode(HttpStatus.CREATED)
  async store(@Body() body: CreateBulkProduk): Promise<SuccessResponse> {
    try {
      const data = await this.produkService.createBulkProduk(body);

      return {
        success: true,
        status_code: HttpStatus.CREATED,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateProdukSchema))
  async update(@Body() body: UpdateProdukDto): Promise<SuccessResponse> {
    try {
      const data = await this.produkService.updateProduk(body);
      return {
        success: true,
        status_code: HttpStatus.OK,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch('stok')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateStokProdukSchema))
  async updateStok(
    @Body() body: UpdateStokProdukType,
  ): Promise<SuccessResponse> {
    try {
      const data = await this.produkService.updateStokProduk(body);
      return {
        success: true,
        status_code: HttpStatus.OK,
        data,
      };
    } catch (error) {
      throw error;
    }
  }
}
