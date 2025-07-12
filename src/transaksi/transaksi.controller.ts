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
  Query,
  UsePipes,
} from '@nestjs/common';
import { SuccessResponse } from '../utils/global/global.response';
import { ZodValidationPipe } from '../utils/pipes/zod.pipe';
import {
  CreateTransaksiDto,
  TransaksiQuery,
  UpdateStateDto,
  createTransaksiSchema,
  updateStateSchema,
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

  // @Patch()
  // @UsePipes(new ZodValidationPipe(updateTransaksiSchema))
  // @HttpCode(HttpStatus.OK)
  // async update(@Body() body: UpdateTransaksiDto): Promise<SuccessResponse> {
  //   try {
  //     return {
  //       success: true,
  //       status_code: HttpStatus.OK,
  //       data: await this.transaksiService.updateTransaksi(body),
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  @Patch('/state')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateStateSchema))
  async updateState(@Body() body: UpdateStateDto): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.transaksiService.updateTransaksiState(body),
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':transaksi_id')
  @HttpCode(HttpStatus.OK)
  async deleteTransaksi(
    @Param('transaksi_id') transaksi_id: string,
  ): Promise<SuccessResponse> {
    try {
      await this.transaksiService.deleteTransaksi(transaksi_id);
      return {
        success: true,
        status_code: HttpStatus.OK,
        message: 'Transaksi deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
