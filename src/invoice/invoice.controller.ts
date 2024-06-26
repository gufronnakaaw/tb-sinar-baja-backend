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
  CreateInvoiceDto,
  CreateInvoicePaymentDto,
  InvoiceQuery,
  PaymentInvoutDto,
  UpdateInvoutDto,
  createInvoicePaymentSchema,
  createInvoiceSchema,
  paymentInvoutSchema,
  updateInvoutSchema,
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

  @Get('out')
  @HttpCode(HttpStatus.OK)
  async indexInvout(@Query() query: InvoiceQuery): Promise<SuccessResponse> {
    try {
      if (query.id_invoice) {
        return {
          success: true,
          status_code: HttpStatus.OK,
          data: await this.invoiceService.getInvoutById(query.id_invoice),
        };
      }

      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.invoiceService.getInvout(),
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch('out')
  @UsePipes(new ZodValidationPipe(updateInvoutSchema))
  @HttpCode(HttpStatus.CREATED)
  async updateInvout(@Body() body: UpdateInvoutDto): Promise<SuccessResponse> {
    try {
      const data = await this.invoiceService.updateInvout(body);

      return {
        success: true,
        status_code: HttpStatus.CREATED,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('out/payment')
  @UsePipes(new ZodValidationPipe(paymentInvoutSchema))
  @HttpCode(HttpStatus.OK)
  async paymentInvout(
    @Body() body: PaymentInvoutDto,
  ): Promise<SuccessResponse> {
    try {
      const data = await this.invoiceService.paymentInvout(body);

      return {
        success: true,
        status_code: HttpStatus.OK,
        data,
      };
    } catch (error) {
      throw error;
    }
  }
}
