import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Order } from '../../store/entities/order.entity';
import { User } from '../../users/entities/user.entity';

export type PaymentMethod = 'pix' | 'credit_card' | 'boleto';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

@Entity('payment_transactions')
@Index(['tenantId', 'gatewayTransactionId'], { unique: true })
export class PaymentTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id', length: 36 })
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'user_id', length: 36 })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'gateway_transaction_id', length: 150 })
  gatewayTransactionId: string;

  @Column({ name: 'payment_method', type: 'enum', enum: ['pix', 'credit_card', 'boleto'] })
  paymentMethod: PaymentMethod;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' })
  status: PaymentStatus;

  @Column({ name: 'gateway_payload', type: 'json', nullable: true })
  gatewayPayload: Record<string, unknown> | null;

  @Column({ name: 'tenant_id', length: 36 })
  tenantId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
