import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { UserSubscription } from './entities/user-subscription.entity';

@Injectable()
export class SubscriptionsRepository {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly plans: Repository<SubscriptionPlan>,
    @InjectRepository(UserSubscription)
    private readonly subscriptions: Repository<UserSubscription>,
  ) {}

  createPlan(data: Partial<SubscriptionPlan>) {
    return this.plans.create(data);
  }

  savePlan(plan: SubscriptionPlan) {
    return this.plans.save(plan);
  }

  findPlan(where: FindOptionsWhere<SubscriptionPlan>) {
    return this.plans.findOne({ where });
  }

  listPlans(tenantId: string) {
    return this.plans.find({ where: { tenantId, isActive: true }, order: { price: 'ASC' } });
  }

  createSubscription(data: Partial<UserSubscription>) {
    return this.subscriptions.create(data);
  }

  saveSubscription(subscription: UserSubscription) {
    return this.subscriptions.save(subscription);
  }

  findSubscription(where: FindOptionsWhere<UserSubscription>) {
    return this.subscriptions.findOne({ where, relations: ['plan'] });
  }
}
