import { Body, Controller, Headers, HttpCode, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly configService: ConfigService,
  ) {}

  @Post('webhook')
  @HttpCode(200)
  webhook(
    @Body() payload: PaymentWebhookDto,
    @Headers('x-abacete-pay-signature') abaceteSignature?: string,
    @Headers('x-payment-signature') genericSignature?: string,
  ) {
    const secretToken =
      this.configService.get<string>('ABACETE_PAY_WEBHOOK_TOKEN') ??
      this.configService.getOrThrow<string>('PAYMENT_WEBHOOK_TOKEN');
    const signature = abaceteSignature ?? genericSignature;
    return this.paymentsService.processWebhook(payload, signature, secretToken);
  }
}
