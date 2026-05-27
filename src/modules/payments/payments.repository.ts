import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserSubscription } from '../subscriptions/entities/user-subscription.entity';
import { Order } from '../store/entities/order.entity';
import { PaymentTransaction } from './entities/payment-transaction.entity';

@Injectable()
export class PaymentsRepository {
  constructor(
    @InjectRepository(PaymentTransaction)
    private readonly transactions: Repository<PaymentTransaction>,
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(UserSubscription)
    private readonly subscriptions: Repository<UserSubscription>,
    private readonly dataSource: DataSource,
  ) {}

  findOrder(id: string) {
    return this.orders.findOne({ where: { id }, relations: ['items'] });
  }

  saveSubscription(subscription: UserSubscription) {
    return this.subscriptions.save(subscription);
  }

  findSubscription(userId: string, tenantId: string) {
    return this.subscriptions.findOne({ where: { userId, tenantId } });
  }

  createQueryRunner() {
    return this.dataSource.createQueryRunner();
  }

  createTransaction(data: Partial<PaymentTransaction>) {
    return this.transactions.create(data);
  }
}
