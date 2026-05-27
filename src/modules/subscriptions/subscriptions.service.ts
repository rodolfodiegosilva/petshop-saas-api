import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TenantContext } from '../../common/middleware/tenant-context';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { SubscriptionsRepository } from './subscriptions.repository';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly subscriptionsRepository: SubscriptionsRepository) {}

  async createPlan(dto: CreateSubscriptionPlanDto) {
    const tenantId = TenantContext.getTenantId();
    const existing = await this.subscriptionsRepository.findPlan({ tenantId, name: dto.name });
    if (existing) throw new ConflictException('Subscription plan already exists in this tenant.');

    const plan = this.subscriptionsRepository.createPlan({
      ...dto,
      tenantId,
      isActive: dto.isActive ?? true,
    });
    return this.subscriptionsRepository.savePlan(plan);
  }

  listPlans() {
    return this.subscriptionsRepository.listPlans(TenantContext.getTenantId());
  }

  async subscribe(dto: CreateUserSubscriptionDto) {
    const tenantId = TenantContext.getTenantId();
    const plan = await this.subscriptionsRepository.findPlan({ id: dto.planId, tenantId, isActive: true });
    if (!plan) throw new NotFoundException('Subscription plan not found.');

    const existing = await this.subscriptionsRepository.findSubscription({ userId: dto.userId, tenantId });
    if (existing) throw new ConflictException('User already has a subscription in this tenant.');

    const subscription = this.subscriptionsRepository.createSubscription({
      ...dto,
      tenantId,
      status: 'active',
      startDate: new Date(dto.startDate),
      nextBillingDate: new Date(dto.nextBillingDate),
    });
    return this.subscriptionsRepository.saveSubscription(subscription);
  }
}
