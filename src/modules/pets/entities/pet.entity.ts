import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { MedicalRecord } from '../../medical-records/entities/medical-record.entity';
import { User } from '../../users/entities/user.entity';

export type PetSex = 'Macho' | 'Fêmea' | 'Não informado';

@Entity('pets')
@Index(['tenantId', 'tutorId'])
export class Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  species: string;

  @Column({ type: 'enum', enum: ['Macho', 'Fêmea', 'Não informado'], default: 'Não informado' })
  sex: PetSex;

  @Column({ length: 100 })
  breed: string;

  @Column({ length: 50 })
  age: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight: number;

  @Column({ length: 10 })
  avatar: string;

  @Column({ type: 'text', nullable: true })
  observation: string | null;

  @Column({ type: 'json', nullable: true })
  vaccines: string[] | null;

  @Column({ name: 'tenant_id', length: 36 })
  tenantId: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, unknown> | null;

  @Column({ name: 'tutor_id', length: 36 })
  tutorId: string;

  @ManyToOne(() => User, (user) => user.pets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tutor_id' })
  tutor: User;

  @OneToMany(() => Appointment, (appointment) => appointment.pet)
  appointments: Appointment[];

  @OneToMany(() => MedicalRecord, (record) => record.pet)
  medicalRecords: MedicalRecord[];
}
