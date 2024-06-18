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
import {
  CreateTransaksiDto,
  PaymentTransaksiDto,
  TransaksiQuery,
  createTransaksiSchema,
  paymentTransaksiSchema,
} from './transaksi.dto';
import { TransaksiService } from './transaksi.service';

@Controller('transaksi')
export class TransaksiController {
  constructor(private readonly transaksiService: TransaksiService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async index(@Query() query: TransaksiQuery): Promise<SuccessResponse> {
    try {
      if (query.id) {
        const data = await this.transaksiService.getTransaksiById(query.id);
        return {
          success: true,
          status_code: HttpStatus.OK,
          data,
        };
      }

      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.transaksiService.getTransaksi(query),
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

  @Post('payment')
  @UsePipes(new ZodValidationPipe(paymentTransaksiSchema))
  @HttpCode(HttpStatus.CREATED)
  async payment(@Body() body: PaymentTransaksiDto): Promise<SuccessResponse> {
    try {
      const data = await this.transaksiService.payment(body);

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
