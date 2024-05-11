import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { SuccessResponse } from '../utils/global/global.response';
import { ProdukQuery } from './produk.dto';
import { ProdukService } from './produk.service';

@Controller('produk')
export class ProdukController {
  constructor(private readonly produkService: ProdukService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async index(@Query() query: ProdukQuery): Promise<SuccessResponse> {
    try {
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
}
