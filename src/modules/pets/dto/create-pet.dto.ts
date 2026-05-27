import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';
import { PetSex } from '../entities/pet.entity';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  species: string;

  @IsEnum(['Macho', 'Fêmea', 'Não informado'])
  sex: PetSex;

  @IsString()
  @IsNotEmpty()
  breed: string;

  @IsString()
  @IsNotEmpty()
  age: string;

  @IsNumber()
  weight: number;

  @IsString()
  @MaxLength(10)
  avatar: string;

  @IsOptional()
  @IsString()
  observation?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
