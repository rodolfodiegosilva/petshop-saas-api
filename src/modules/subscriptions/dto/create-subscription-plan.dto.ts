import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateSubscriptionPlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  petLimit: number;

  @IsNumber()
  @Min(0)
  storeDiscount: number;

  @IsNumber()
  @Min(0)
  freeBathsPerMonth: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
