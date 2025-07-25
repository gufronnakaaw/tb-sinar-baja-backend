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
  CreateBankDto,
  CreateSupplierDto,
  CreateSupplierPricelistDto,
  SupplierPricelistQuery,
  UpdateBankDto,
  UpdateSupplierDto,
  UpdateSupplierPricelistDto,
  createBankSchema,
  createSupplierPricelistSchema,
  createSupplierSchema,
  updateBankSchema,
  updateSupplierPricelistSchema,
  updateSupplierSchema,
} from './supplier.dto';
import { SupplierService } from './supplier.service';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async index(): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.supplierService.getSupplier(),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createSupplierSchema))
  async store(@Body() body: CreateSupplierDto): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.CREATED,
        data: await this.supplierService.createSupplier(body),
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateSupplierSchema))
  async update(@Body() body: UpdateSupplierDto): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.supplierService.updateSupplier(body),
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id_supplier')
  @HttpCode(HttpStatus.OK)
  async destroy(
    @Param('id_supplier') id_supplier: string,
  ): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.supplierService.deleteSupplier(id_supplier),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('bank')
  @HttpCode(HttpStatus.OK)
  async getBank(
    @Query() query: SupplierPricelistQuery,
  ): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.supplierService.getSupplierBank(query.id_supplier),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('bank')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createBankSchema))
  async createBank(@Body() body: CreateBankDto): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.CREATED,
        data: await this.supplierService.createSupplierBank(body),
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch('bank')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateBankSchema))
  async updateBank(@Body() body: UpdateBankDto): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.supplierService.updateSupplierBank(body),
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete('bank/:supplier_id/:id_table')
  @HttpCode(HttpStatus.OK)
  async destroyBank(
    @Param() params: { supplier_id: string; id_table: string },
  ): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.supplierService.deleteSupplierBank(params),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('pricelist')
  @HttpCode(HttpStatus.OK)
  async getPricelist(
    @Query() query: SupplierPricelistQuery,
  ): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.supplierService.getPricelist(query),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('pricelist')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createSupplierPricelistSchema))
  async createPricelist(
    @Body() body: CreateSupplierPricelistDto,
  ): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.CREATED,
        data: await this.supplierService.createPricelist(body),
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch('pricelist')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateSupplierPricelistSchema))
  async updatePricelist(
    @Body() body: UpdateSupplierPricelistDto,
  ): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.supplierService.updatePricelist(body),
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete('pricelist/:supplier_id/:produk_id')
  @HttpCode(HttpStatus.OK)
  async destroyPricelist(
    @Param() params: { supplier_id: string; produk_id: string },
  ): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.supplierService.deletePricelist(params),
      };
    } catch (error) {
      throw error;
    }
  }
}
