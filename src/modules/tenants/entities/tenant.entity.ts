import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ unique: true, length: 100 })
  slug: string;

  @Column({ name: 'api_key', unique: true, length: 150 })
  apiKey: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'allowed_domains', type: 'json', nullable: true })
  allowedDomains: string[] | null;

  @Column({ name: 'branding_config', type: 'json', nullable: true })
  brandingConfig: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
