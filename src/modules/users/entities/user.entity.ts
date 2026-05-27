import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Role } from '../../auth/enums/role.enum';
import { Pet } from '../../pets/entities/pet.entity';
import { Order } from '../../store/entities/order.entity';
import { UserSubscription } from '../../subscriptions/entities/user-subscription.entity';

@Entity('users')
@Index(['tenantId', 'email'], { unique: true })
@Index(['tenantId', 'cpf'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 14 })
  cpf: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 100, nullable: true })
  neighborhood: string | null;

  @Column({ length: 50, nullable: true })
  city: string | null;

  @Column({ type: 'enum', enum: Role, default: Role.CLIENT })
  role: Role;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'tenant_id', length: 36 })
  tenantId: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, unknown> | null;

  @OneToMany(() => Pet, (pet) => pet.tutor)
  pets: Pet[];

  @OneToMany(() => Appointment, (appointment) => appointment.tutor)
  appointments: Appointment[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToOne(() => UserSubscription, (subscription) => subscription.user)
  subscription: UserSubscription;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }
}
