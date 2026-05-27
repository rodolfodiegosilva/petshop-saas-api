import { IsNotEmpty, IsString } from 'class-validator';

export class ApplyVaccineDto {
  @IsString()
  @IsNotEmpty()
  vaccineName: string;
}
