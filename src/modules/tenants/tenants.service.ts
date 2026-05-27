import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { TenantsRepository } from './tenants.repository';

@Injectable()
export class TenantsService {
  constructor(
    private readonly tenantsRepository: TenantsRepository,
  ) {}

  async create(dto: CreateTenantDto) {
    const existing = await this.tenantsRepository.findOne([{ slug: dto.slug }, { apiKey: dto.apiKey }]);
    if (existing) {
      throw new ConflictException('Tenant slug or API key already exists.');
    }

    const tenant = this.tenantsRepository.create({
      ...dto,
      isActive: dto.isActive ?? true,
      allowedDomains: dto.allowedDomains ?? [],
      brandingConfig: dto.brandingConfig ?? null,
    });
    return this.tenantsRepository.save(tenant);
  }

  async getPublicConfig(tenantId: string) {
    const tenant = await this.tenantsRepository.findOne({ id: tenantId, isActive: true });
    if (!tenant) throw new NotFoundException('Tenant not found.');

    return {
      petshop: tenant.name,
      tenantId: tenant.id,
      slug: tenant.slug,
      branding: tenant.brandingConfig ?? {
        primaryColor: '#00adb5',
        secondaryColor: '#393e46',
        logoUrl: null,
        faviconUrl: null,
        typography: 'Inter',
        enabledModules: ['appointments', 'store'],
      },
    };
  }
}
