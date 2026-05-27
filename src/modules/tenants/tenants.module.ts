import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { DynamicTenantResolver } from './dynamic-tenant.resolver';
import { TenantsController } from './tenants.controller';
import { TenantsRepository } from './tenants.repository';
import { TenantsService } from './tenants.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [TenantsController],
  providers: [DynamicTenantResolver, TenantsService, TenantsRepository],
  exports: [DynamicTenantResolver, TenantsService, TenantsRepository],
})
export class TenantsModule {}
