import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { MedicalRecord } from '../../medical-records/entities/medical-record.entity';

export type VeterinarianShift = 'Diurno' | 'Noturno' | 'Integral';
export type VeterinarianStatus = 'Disponível' | 'Últimas vagas' | 'Agenda cheia';

@Entity('veterinarians')
@Index(['tenantId', 'crmv'], { unique: true })
export class Veterinarian {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 20 })
  crmv: string;

  @Column({ length: 100 })
  specialty: string;

  @Column({ type: 'enum', enum: ['Diurno', 'Noturno', 'Integral'], default: 'Diurno' })
  shift: VeterinarianShift;

  @Column({ type: 'enum', enum: ['Disponível', 'Últimas vagas', 'Agenda cheia'], default: 'Disponível' })
  status: VeterinarianStatus;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'tenant_id', length: 36 })
  tenantId: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, unknown> | null;

  @OneToMany(() => Appointment, (appointment) => appointment.veterinarian)
  appointments: Appointment[];

  @OneToMany(() => MedicalRecord, (record) => record.veterinarian)
  medicalRecords: MedicalRecord[];
}
