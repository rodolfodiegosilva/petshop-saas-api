import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TenantContext } from '../../common/middleware/tenant-context';
import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';
import { FeatureFlagsRepository } from './feature-flags.repository';

interface UserForFeatureFlag {
  id?: string;
  role?: string;
  subscription?: { plan?: { name?: string } };
}

@Injectable()
export class FeatureFlagsService {
  constructor(private readonly featureFlagsRepository: FeatureFlagsRepository) {}

  async create(dto: CreateFeatureFlagDto) {
    const tenantId = TenantContext.getTenantId();
    const existing = await this.featureFlagsRepository.findOne({ tenantId, key: dto.key });
    if (existing) throw new ConflictException('Feature flag already exists in this tenant.');

    const flag = this.featureFlagsRepository.create({
      ...dto,
      tenantId,
      isEnabled: dto.isEnabled ?? true,
      rules: dto.rules ?? null,
    });
    return this.featureFlagsRepository.save(flag);
  }

  list() {
    return this.featureFlagsRepository.list(TenantContext.getTenantId());
  }

  async isEnabled(key: string, user?: UserForFeatureFlag) {
    const tenantId = TenantContext.getTenantId();
    const flag = await this.featureFlagsRepository.findOne({ tenantId, key });
    if (!flag?.isEnabled) return false;

    if (flag.rules && user) {
      const { allowedRoles, allowedPlans, allowedUserIds } = flag.rules;
      if (allowedRoles?.length && (!user.role || !allowedRoles.includes(user.role))) return false;
      if (allowedUserIds?.length && (!user.id || !allowedUserIds.includes(user.id))) return false;
      if (allowedPlans?.length) {
        const plan = user.subscription?.plan?.name || 'Essential';
        if (!allowedPlans.includes(plan)) return false;
      }
    }
    return true;
  }

  async toggle(key: string) {
    const tenantId = TenantContext.getTenantId();
    const flag = await this.featureFlagsRepository.findOne({ tenantId, key });
    if (!flag) throw new NotFoundException('Feature flag not found in this tenant.');
    flag.isEnabled = !flag.isEnabled;
    return this.featureFlagsRepository.save(flag);
  }
}
