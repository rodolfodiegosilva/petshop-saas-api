import { BadRequestException, Injectable } from '@nestjs/common';
import { TenantsRepository } from './tenants.repository';

interface TenantResolveInput {
  origin?: string | string[];
  host?: string | string[];
  tenantId?: string | string[];
  apiKey?: string | string[];
}

function headerValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function cleanDomain(value: string) {
  return value.replace(/(^\w+:|^)\/\//, '').split(':')[0];
}

@Injectable()
export class DynamicTenantResolver {
  constructor(
    private readonly tenantsRepository: TenantsRepository,
  ) {}

  async resolve(input: TenantResolveInput): Promise<string> {
    const headerTenantId = headerValue(input.tenantId);
    const apiKey = headerValue(input.apiKey);

    if (headerTenantId) {
      const tenant = await this.tenantsRepository.findOne({ id: headerTenantId, isActive: true });
      if (tenant) return tenant.id;
    }

    if (apiKey) {
      const tenant = await this.tenantsRepository.findOne({ apiKey, isActive: true });
      if (tenant) return tenant.id;
    }

    const targetOrigin = headerValue(input.origin) || headerValue(input.host);
    if (targetOrigin) {
      const domain = cleanDomain(targetOrigin);
      const tenant = await this.tenantsRepository.findActiveByDomain(domain);
      if (tenant) return tenant.id;
    }

    throw new BadRequestException('Active tenant was not identified for this request.');
  }
}
