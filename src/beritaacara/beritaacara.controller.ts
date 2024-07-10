import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { SuccessResponse } from 'src/utils/global/global.response';
import { BeritaAcaraQuery, CreateBeritaAcaraDto } from './beritaacara.dto';
import { BeritaacaraService } from './beritaacara.service';

@Controller('beritaacara')
export class BeritaacaraController {
  constructor(private readonly beritaacaraService: BeritaacaraService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async index(@Query() query: BeritaAcaraQuery): Promise<SuccessResponse> {
    try {
      if (query.id_ba) {
        return {
          success: true,
          status_code: HttpStatus.OK,
          data: await this.beritaacaraService.getBeritaAcaraById(query.id_ba),
        };
      }

      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.beritaacaraService.getBeritaAcara(),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async store(@Body() body: CreateBeritaAcaraDto): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.CREATED,
        data: await this.beritaacaraService.createBeritaAcara(body),
      };
    } catch (error) {
      throw error;
    }
  }
}
