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
import { SuccessResponse } from 'src/utils/global/global.response';
import { ZodValidationPipe } from 'src/utils/pipes/zod.pipe';
import { CreateReturnDto, ReturnQuery, createReturnSchema } from './return.dto';
import { ReturnService } from './return.service';

@Controller('return')
export class ReturnController {
  constructor(private readonly returnService: ReturnService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async index(@Query() query: ReturnQuery): Promise<SuccessResponse> {
    try {
      if (query.id_return) {
        const data = await this.returnService.getReturnById(query.id_return);
        return {
          success: true,
          status_code: HttpStatus.OK,
          data,
        };
      }

      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.returnService.getReturn(),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createReturnSchema))
  async store(@Body() body: CreateReturnDto): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.CREATED,
        data: await this.returnService.createReturn(body),
      };
    } catch (error) {
      throw error;
    }
  }
}
