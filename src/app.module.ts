import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { CashierModule } from './cashier/cashier.module';
import { OwnerModule } from './owner/owner.module';

@Module({
  imports: [OwnerModule, AdminModule, CashierModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
