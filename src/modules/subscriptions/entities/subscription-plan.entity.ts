import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserSubscription } from './user-subscription.entity';

@Entity('subscription_plans')
@Index(['tenantId', 'name'], { unique: true })
export class SubscriptionPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'pet_limit', type: 'int', default: 1 })
  petLimit: number;

  @Column({ name: 'store_discount', type: 'decimal', precision: 4, scale: 2, default: 0.0 })
  storeDiscount: number;

  @Column({ name: 'free_baths_per_month', type: 'int', default: 0 })
  freeBathsPerMonth: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'tenant_id', length: 36 })
  tenantId: string;

  @OneToMany(() => UserSubscription, (sub) => sub.plan)
  subscriptions: UserSubscription[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
