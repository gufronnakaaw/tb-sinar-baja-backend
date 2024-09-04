import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { SuccessResponse } from 'src/utils/global/global.response';
import { KeuanganQuery } from './keuangan.dto';
import { KeuanganService } from './keuangan.service';

@Controller('keuangan')
export class KeuanganController {
  constructor(private readonly keuanganService: KeuanganService) {}

  @Get('profit')
  @HttpCode(HttpStatus.OK)
  async getProfit(@Query() query: KeuanganQuery): Promise<SuccessResponse> {
    try {
      if (query.date) {
        const data = await this.keuanganService.detailProfit(query.date);
        return {
          success: true,
          status_code: HttpStatus.OK,
          data,
        };
      }

      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.keuanganService.getProfit(query),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('loss')
  @HttpCode(HttpStatus.OK)
  async getLoss(@Query() query: KeuanganQuery): Promise<SuccessResponse> {
    try {
      if (query.date) {
        const data = await this.keuanganService.detailLoss(query.date);
        return {
          success: true,
          status_code: HttpStatus.OK,
          data,
        };
      }

      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.keuanganService.getLoss(query),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('debt')
  @HttpCode(HttpStatus.OK)
  async getDebt(@Query() query: KeuanganQuery): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.keuanganService.getDebt(query),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('receivable')
  @HttpCode(HttpStatus.OK)
  async getReceivable(@Query() query: KeuanganQuery): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.keuanganService.getReceivable(query),
      };
    } catch (error) {
      throw error;
    }
  }
}
