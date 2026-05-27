import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FeatureFlag } from './entities/feature-flag.entity';

@Injectable()
export class FeatureFlagsRepository {
  constructor(
    @InjectRepository(FeatureFlag)
    private readonly repository: Repository<FeatureFlag>,
  ) {}

  create(data: Partial<FeatureFlag>) {
    return this.repository.create(data);
  }

  save(flag: FeatureFlag) {
    return this.repository.save(flag);
  }

  findOne(where: FindOptionsWhere<FeatureFlag>) {
    return this.repository.findOne({ where });
  }

  list(tenantId: string) {
    return this.repository.find({ where: { tenantId }, order: { key: 'ASC' } });
  }
}
