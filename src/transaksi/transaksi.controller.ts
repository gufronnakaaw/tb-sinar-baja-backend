import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { SuccessResponse } from '../utils/global/global.response';
import { ZodValidationPipe } from '../utils/pipes/zod.pipe';
import { CreateTransaksiDto, createTransaksiSchema } from './transaksi.dto';
import { TransaksiService } from './transaksi.service';

@Controller('transaksi')
export class TransaksiController {
  constructor(private readonly transaksiService: TransaksiService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async index(@Query('id') id: string): Promise<SuccessResponse> {
    try {
      if (id) {
        const data = await this.transaksiService.getTransaksiById(id);
        return {
          success: true,
          status_code: HttpStatus.OK,
          data,
        };
      }

      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.transaksiService.getTransaksi(),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createTransaksiSchema))
  @HttpCode(HttpStatus.CREATED)
  async store(@Body() body: CreateTransaksiDto): Promise<SuccessResponse> {
    try {
      const data = await this.transaksiService.createTransaksi(body);

      return {
        success: true,
        status_code: HttpStatus.CREATED,
        data,
      };
    } catch (error) {
      throw error;
    }
  }
}
