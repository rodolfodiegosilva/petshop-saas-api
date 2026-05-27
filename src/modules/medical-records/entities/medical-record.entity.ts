import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';
import { Veterinarian } from '../../veterinarians/entities/veterinarian.entity';

export type MedicalRecordStatus = 'Estável' | 'Atenção' | 'Em tratamento';

@Entity('medical_records')
@Index(['tenantId', 'petId'])
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'record_date' })
  date: Date;

  @Column({ type: 'text' })
  diagnosis: string;

  @Column({ type: 'text' })
  prescription: string;

  @Column({ name: 'return_window', length: 100 })
  returnWindow: string;

  @Column({ type: 'enum', enum: ['Estável', 'Atenção', 'Em tratamento'], default: 'Estável' })
  status: MedicalRecordStatus;

  @Column({ type: 'text' })
  symptoms: string;

  @Column({ name: 'clinical_notes', type: 'text' })
  clinicalNotes: string;

  @Column({ name: 'exams_requested', type: 'json', nullable: true })
  examsRequested: string[] | null;

  @Column({ type: 'json', nullable: true })
  recommendations: string[] | null;

  @Column({ name: 'prescription_items', type: 'json', nullable: true })
  prescriptionItems: string[] | null;

  @Column({ name: 'tenant_id', length: 36 })
  tenantId: string;

  @Column({ name: 'pet_id' })
  petId: number;

  @ManyToOne(() => Pet, (pet) => pet.medicalRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @Column({ name: 'veterinarian_id' })
  veterinarianId: number;

  @ManyToOne(() => Veterinarian, (vet) => vet.medicalRecords, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'veterinarian_id' })
  veterinarian: Veterinarian;
}
