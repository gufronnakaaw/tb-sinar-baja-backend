import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { SuccessResponse } from '../utils/global/global.response';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async index(
    @Query('role') role: 'owner' | 'admin' | 'cashier',
  ): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.dashboardService.getDashboardData(role),
      };
    } catch (error) {
      throw error;
    }
  }
}
