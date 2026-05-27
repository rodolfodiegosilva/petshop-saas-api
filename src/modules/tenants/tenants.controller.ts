import { Body, Controller, Get, Headers, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { DynamicTenantResolver } from './dynamic-tenant.resolver';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly resolver: DynamicTenantResolver,
  ) {}

  @Post()
  create(@Body() dto: CreateTenantDto) {
    return this.tenantsService.create(dto);
  }

  @Get('config')
  async config(
    @Req() req: Request,
    @Headers('x-tenant-id') tenantId?: string,
    @Headers('x-api-key') apiKey?: string,
  ) {
    const resolvedTenantId = await this.resolver.resolve({
      origin: req.headers.origin,
      host: req.headers.host,
      tenantId,
      apiKey,
    });
    return this.tenantsService.getPublicConfig(resolvedTenantId);
  }
}
