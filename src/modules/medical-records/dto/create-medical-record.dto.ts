import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MedicalRecordStatus } from '../entities/medical-record.entity';

export class CreateMedicalRecordDto {
  @IsNumber()
  petId: number;

  @IsNumber()
  veterinarianId: number;

  @IsString()
  @IsNotEmpty()
  diagnosis: string;

  @IsString()
  @IsNotEmpty()
  prescription: string;

  @IsString()
  @IsNotEmpty()
  returnWindow: string;

  @IsEnum(['Estável', 'Atenção', 'Em tratamento'])
  status: MedicalRecordStatus;

  @IsString()
  @IsNotEmpty()
  symptoms: string;

  @IsString()
  @IsNotEmpty()
  clinicalNotes: string;

  @IsOptional()
  @IsArray()
  examsRequested?: string[];

  @IsOptional()
  @IsArray()
  recommendations?: string[];

  @IsOptional()
  @IsArray()
  prescriptionItems?: string[];
}
