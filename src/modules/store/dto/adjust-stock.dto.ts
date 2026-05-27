import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { StockMovementType } from '../entities/stock-movement.entity';

export class AdjustStockDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsEnum(['manual_adjustment', 'replenishment', 'loss'])
  type: Extract<StockMovementType, 'manual_adjustment' | 'replenishment' | 'loss'>;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
