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
  CreatePenawaranDto,
  PenawaranQuery,
  UpdateStatusPenawaranDto,
  createPenawaranSchema,
  updateStatusPenawaranSchema,
} from './penawaran.dto';
import { PenawaranService } from './penawaran.service';

@Controller('penawaran')
export class PenawaranController {
  constructor(private readonly penawaranService: PenawaranService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async index(@Query() query: PenawaranQuery): Promise<SuccessResponse> {
    try {
      if (query.id_penawaran) {
        return {
          success: true,
          status_code: HttpStatus.OK,
          data: await this.penawaranService.getPenawaranById(
            query.id_penawaran,
          ),
        };
      }

      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.penawaranService.getPenawaran(),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createPenawaranSchema))
  async store(@Body() body: CreatePenawaranDto): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.CREATED,
        data: await this.penawaranService.createPenawaran(body),
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch('status')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateStatusPenawaranSchema))
  async update(
    @Body() body: UpdateStatusPenawaranDto,
  ): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.penawaranService.updateStatus(body),
      };
    } catch (error) {
      throw error;
    }
  }
}
