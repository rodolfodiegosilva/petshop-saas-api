import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PaymentMethod } from '../../payments/entities/payment-transaction.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

export type SubscriptionStatus = 'active' | 'suspended' | 'cancelled' | 'past_due';

@Entity('user_subscriptions')
@Index(['tenantId', 'userId'], { unique: true })
export class UserSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', length: 36 })
  userId: string;

  @OneToOne(() => User, (user) => user.subscription, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'plan_id' })
  planId: number;

  @ManyToOne(() => SubscriptionPlan, (plan) => plan.subscriptions, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'plan_id' })
  plan: SubscriptionPlan;

  @Column({ type: 'enum', enum: ['active', 'suspended', 'cancelled', 'past_due'], default: 'active' })
  status: SubscriptionStatus;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'next_billing_date', type: 'date' })
  nextBillingDate: Date;

  @Column({ name: 'payment_method', type: 'enum', enum: ['credit_card', 'pix', 'boleto'] })
  paymentMethod: PaymentMethod;

  @Column({ name: 'tenant_id', length: 36 })
  tenantId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
