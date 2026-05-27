import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export interface FeatureFlagRules {
  allowedRoles?: string[];
  allowedPlans?: string[];
  allowedUserIds?: string[];
}

@Entity('feature_flags')
@Index(['tenantId', 'key'], { unique: true })
export class FeatureFlag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  key: string;

  @Column({ length: 250 })
  description: string;

  @Column({ name: 'is_enabled', default: true })
  isEnabled: boolean;

  @Column({ type: 'json', nullable: true })
  rules: FeatureFlagRules | null;

  @Column({ name: 'tenant_id', length: 36 })
  tenantId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
