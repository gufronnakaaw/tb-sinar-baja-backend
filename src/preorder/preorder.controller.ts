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
  CreatePreorderDto,
  PreorderQuery,
  createPreorderSchema,
} from './preorder.dto';
import { PreorderService } from './preorder.service';

@Controller('preorder')
export class PreorderController {
  constructor(private readonly preorderService: PreorderService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async index(@Query() query: PreorderQuery): Promise<SuccessResponse> {
    try {
      if (query.id_preorder) {
        return {
          success: true,
          status_code: HttpStatus.OK,
          data: await this.preorderService.getPreorderById(query.id_preorder),
        };
      }

      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.preorderService.getPreorder(),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createPreorderSchema))
  async store(@Body() body: CreatePreorderDto): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.CREATED,
        data: await this.preorderService.createPreorder(body),
      };
    } catch (error) {
      throw error;
    }
  }
}
