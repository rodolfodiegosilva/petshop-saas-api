import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';
import { AppointmentType } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsEnum(['Serviço', 'Táxi Pet'])
  type: AppointmentType;

  @IsString()
  @IsNotEmpty()
  service: string;

  @IsDateString()
  date: string;

  @IsString()
  @MaxLength(5)
  time: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  petId: number;

  @IsString()
  tutorId: string;

  @IsOptional()
  @IsNumber()
  veterinarianId?: number;

  @IsOptional()
  @IsString()
  pickupAddress?: string;

  @IsOptional()
  @IsString()
  destinationAddress?: string;

  @IsOptional()
  @IsEnum(['Somente ida', 'Ida e volta'])
  transportMode?: 'Somente ida' | 'Ida e volta';

  @IsOptional()
  @IsEnum(['Tutor acompanha', 'Pet desacompanhado'])
  companion?: 'Tutor acompanha' | 'Pet desacompanhado';

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
