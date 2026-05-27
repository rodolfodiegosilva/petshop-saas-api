import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from './product.entity';

export type StockMovementType = 'sale' | 'cancellation_return' | 'manual_adjustment' | 'replenishment' | 'loss';

@Entity('stock_movements')
@Index(['tenantId', 'productId'])
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'user_id', length: 36, nullable: true })
  userId: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'enum', enum: ['sale', 'cancellation_return', 'manual_adjustment', 'replenishment', 'loss'] })
  type: StockMovementType;

  @Column({ length: 250, nullable: true })
  reason: string | null;

  @Column({ name: 'tenant_id', length: 36 })
  tenantId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
