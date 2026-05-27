import { IsArray, IsBoolean, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @MaxLength(150)
  name: string;

  @IsString()
  @MaxLength(100)
  slug: string;

  @IsString()
  @MaxLength(150)
  apiKey: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  allowedDomains?: string[];

  @IsOptional()
  @IsObject()
  brandingConfig?: Record<string, unknown>;
}
