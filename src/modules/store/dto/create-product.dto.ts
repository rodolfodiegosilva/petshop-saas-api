import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { ProductCategory } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['Cães', 'Gatos', 'Peixes', 'Aves', 'Répteis', 'Pequenos Pets'])
  category: ProductCategory;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsString()
  imageBg?: string;

  @IsOptional()
  @IsString()
  imageEmoji?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
