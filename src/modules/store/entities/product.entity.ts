import { Column, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export type ProductCategory = 'Cães' | 'Gatos' | 'Peixes' | 'Aves' | 'Répteis' | 'Pequenos Pets';

@Entity('products')
@Index(['tenantId', 'category'])
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'enum', enum: ['Cães', 'Gatos', 'Peixes', 'Aves', 'Répteis', 'Pequenos Pets'] })
  category: ProductCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'original_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice: number | null;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5.0 })
  rating: number;

  @Column({ name: 'image_bg', type: 'varchar', length: 150, nullable: true })
  imageBg: string | null;

  @Column({ name: 'image_emoji', type: 'varchar', length: 10, nullable: true })
  imageEmoji: string | null;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ name: 'tenant_id', length: 36 })
  tenantId: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, unknown> | null;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true, select: false })
  deletedAt: Date | null;
}
