import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../store/entities/product.entity';
import { StockMovement } from '../store/entities/stock-movement.entity';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';
import { PaymentMethod } from './entities/payment-transaction.entity';
import { PaymentsRepository } from './payments.repository';

interface PaymentData {
  orderId?: string;
  transactionId?: string;
  paymentMethod?: PaymentMethod;
  userId?: string;
  tenantId?: string;
}

@Injectable()
export class PaymentsService {
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  async processWebhook(payload: PaymentWebhookDto, signature: string | undefined, secretToken: string) {
    if (signature !== secretToken) {
      throw new BadRequestException('Invalid payment webhook signature.');
    }

    const data = payload.data as PaymentData;
    if (payload.event === 'payment.paid') await this.handlePaymentPaid(data);
    if (payload.event === 'payment.failed') await this.handlePaymentFailed(data);
    if (payload.event === 'subscription.cancelled') await this.handleSubscriptionCancelled(data);
    return { success: true };
  }

  private async handlePaymentPaid(data: PaymentData) {
    if (!data.orderId || !data.transactionId || !data.paymentMethod) {
      throw new BadRequestException('Payment paid payload is incomplete.');
    }

    const order = await this.paymentsRepository.findOrder(data.orderId);
    if (!order) throw new NotFoundException('Order linked to payment was not found.');

    const queryRunner = this.paymentsRepository.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      order.status = 'Pronto para retirada';
      await queryRunner.manager.save(order);

      const transaction = this.paymentsRepository.createTransaction({
        orderId: order.id,
        userId: order.userId,
        gatewayTransactionId: data.transactionId,
        paymentMethod: data.paymentMethod,
        amount: order.total,
        status: 'paid',
        tenantId: order.tenantId,
        gatewayPayload: data as Record<string, unknown>,
      });
      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async handlePaymentFailed(data: PaymentData) {
    if (!data.orderId || !data.transactionId || !data.paymentMethod) {
      throw new BadRequestException('Payment failed payload is incomplete.');
    }

    const order = await this.paymentsRepository.findOrder(data.orderId);
    if (!order) return;

    const queryRunner = this.paymentsRepository.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      order.status = 'Cancelado';
      await queryRunner.manager.save(order);

      for (const item of order.items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId, tenantId: order.tenantId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!product) continue;
        product.stock += item.quantity;
        await queryRunner.manager.save(product);

        const movement = new StockMovement();
        movement.productId = product.id;
        movement.quantity = item.quantity;
        movement.type = 'cancellation_return';
        movement.tenantId = order.tenantId;
        movement.reason = 'Stock restored after failed payment';
        await queryRunner.manager.save(movement);
      }

      const transaction = this.paymentsRepository.createTransaction({
        orderId: order.id,
        userId: order.userId,
        gatewayTransactionId: data.transactionId,
        paymentMethod: data.paymentMethod,
        amount: order.total,
        status: 'failed',
        tenantId: order.tenantId,
        gatewayPayload: data as Record<string, unknown>,
      });
      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async handleSubscriptionCancelled(data: PaymentData) {
    if (!data.userId || !data.tenantId) {
      throw new BadRequestException('Subscription cancellation payload is incomplete.');
    }
    const subscription = await this.paymentsRepository.findSubscription(data.userId, data.tenantId);
    if (!subscription) return;
    subscription.status = 'cancelled';
    await this.paymentsRepository.saveSubscription(subscription);
  }
}
