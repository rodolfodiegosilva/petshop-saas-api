import { IsIn, IsObject, IsString } from 'class-validator';

export class PaymentWebhookDto {
  @IsIn(['payment.paid', 'payment.failed', 'subscription.cancelled'])
  event: 'payment.paid' | 'payment.failed' | 'subscription.cancelled';

  @IsObject()
  data: Record<string, unknown>;
}
