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
  CreatePenggunaDto,
  PenggunaQuery,
  UpdatePenggunaDto,
  createPenggunaSchema,
  updatePenggunaSchema,
} from './pengguna.dto';
import { PenggunaService } from './pengguna.service';

@Controller('pengguna')
export class PenggunaController {
  constructor(private readonly penggunaService: PenggunaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async index(): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.penggunaService.getPengguna(),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('lihat')
  @HttpCode(HttpStatus.OK)
  async seePassword(@Query() query: PenggunaQuery): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: {
          password: await this.penggunaService.seePassword(query),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createPenggunaSchema))
  async store(@Body() body: CreatePenggunaDto): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.CREATED,
        data: await this.penggunaService.createPengguna(body),
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updatePenggunaSchema))
  async update(@Body() body: UpdatePenggunaDto): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.penggunaService.updatePengguna(body),
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':username')
  @HttpCode(HttpStatus.OK)
  async destroy(@Param('username') username: string): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.penggunaService.deletePengguna(username),
      };
    } catch (error) {
      throw error;
    }
  }
}
