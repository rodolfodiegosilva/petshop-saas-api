import { IsDateString, IsEnum, IsNumber, IsString } from 'class-validator';
import { PaymentMethod } from '../../payments/entities/payment-transaction.entity';

export class CreateUserSubscriptionDto {
  @IsString()
  userId: string;

  @IsNumber()
  planId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  nextBillingDate: string;

  @IsEnum(['credit_card', 'pix', 'boleto'])
  paymentMethod: PaymentMethod;
}
