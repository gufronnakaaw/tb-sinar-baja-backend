import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { SuccessResponse } from '../utils/global/global.response';
import { CreateGudangDto } from './gudang.dto';
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
}
