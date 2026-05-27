import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { VeterinarianShift, VeterinarianStatus } from '../entities/veterinarian.entity';

export class CreateVeterinarianDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  crmv: string;

  @IsString()
  @IsNotEmpty()
  specialty: string;

  @IsEnum(['Diurno', 'Noturno', 'Integral'])
  shift: VeterinarianShift;

  @IsOptional()
  @IsEnum(['Disponível', 'Últimas vagas', 'Agenda cheia'])
  status?: VeterinarianStatus;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
