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
  CreateInvoiceDto,
  CreateInvoicePaymentDto,
  InvoiceQuery,
  createInvoicePaymentSchema,
  createInvoiceSchema,
} from './invoice.dto';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async index(@Query() query: InvoiceQuery): Promise<SuccessResponse> {
    try {
      if (query.id_invoice) {
        return {
          success: true,
          status_code: HttpStatus.OK,
          data: await this.invoiceService.getInvoiceById(query.id_invoice),
        };
      }

      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.invoiceService.getInvoice(),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createInvoiceSchema))
  async store(@Body() body: CreateInvoiceDto): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.CREATED,
        data: await this.invoiceService.createInvoice(body),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('payment')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(createInvoicePaymentSchema))
  async updatePayment(
    @Body() body: CreateInvoicePaymentDto,
  ): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.invoiceService.createPayment(body),
      };
    } catch (error) {
      throw error;
    }
  }
}
