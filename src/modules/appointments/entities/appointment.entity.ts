import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';
import { User } from '../../users/entities/user.entity';
import { Veterinarian } from '../../veterinarians/entities/veterinarian.entity';

export type AppointmentStatus = 'Confirmado' | 'Em análise' | 'Concluído' | 'Cancelado';
export type AppointmentType = 'Serviço' | 'Táxi Pet';

@Entity('appointments')
@Index(['tenantId', 'date'])
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['Serviço', 'Táxi Pet'] })
  type: AppointmentType;

  @Column({ length: 100 })
  service: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ length: 5 })
  time: string;

  @Column({ type: 'enum', enum: ['Confirmado', 'Em análise', 'Concluído', 'Cancelado'], default: 'Em análise' })
  status: AppointmentStatus;

  @Column({ length: 150 })
  location: string;

  @Column({ name: 'pickup_address', type: 'varchar', length: 250, nullable: true })
  pickupAddress: string | null;

  @Column({ name: 'destination_address', type: 'varchar', length: 250, nullable: true })
  destinationAddress: string | null;

  @Column({ name: 'transport_mode', type: 'enum', enum: ['Somente ida', 'Ida e volta'], nullable: true })
  transportMode: 'Somente ida' | 'Ida e volta' | null;

  @Column({ type: 'enum', enum: ['Tutor acompanha', 'Pet desacompanhado'], nullable: true })
  companion: 'Tutor acompanha' | 'Pet desacompanhado' | null;

  @Column({ name: 'tenant_id', length: 36 })
  tenantId: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, unknown> | null;

  @Column({ name: 'pet_id' })
  petId: number;

  @ManyToOne(() => Pet, (pet) => pet.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @Column({ name: 'tutor_id', length: 36 })
  tutorId: string;

  @ManyToOne(() => User, (user) => user.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tutor_id' })
  tutor: User;

  @Column({ name: 'veterinarian_id', type: 'int', nullable: true })
  veterinarianId: number | null;

  @ManyToOne(() => Veterinarian, (vet) => vet.appointments, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'veterinarian_id' })
  veterinarian: Veterinarian | null;
}
