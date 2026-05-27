import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantsRepository {
  constructor(
    @InjectRepository(Tenant)
    private readonly repository: Repository<Tenant>,
  ) {}

  findOne(where: FindOptionsWhere<Tenant> | FindOptionsWhere<Tenant>[]) {
    return this.repository.findOne({ where });
  }

  async findActiveByDomain(domain: string) {
    return this.repository
      .createQueryBuilder('tenant')
      .where('tenant.isActive = true')
      .andWhere('(tenant.slug = :domain OR JSON_CONTAINS(tenant.allowedDomains, :domainJson))', {
        domain,
        domainJson: JSON.stringify(domain),
      })
      .getOne();
  }

  create(data: Partial<Tenant>) {
    return this.repository.create(data);
  }

  save(tenant: Tenant) {
    return this.repository.save(tenant);
  }
}
