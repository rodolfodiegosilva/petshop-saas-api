import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TenantContext } from '../../common/middleware/tenant-context';
import { SubscriptionsRepository } from '../subscriptions/subscriptions.repository';
import { UsersRepository } from '../users/users.repository';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { Product } from './entities/product.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { StoreRepository } from './store.repository';

@Injectable()
export class StoreService {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly usersRepository: UsersRepository,
    private readonly subscriptionsRepository: SubscriptionsRepository,
  ) {}

  createProduct(dto: CreateProductDto) {
    const product = this.storeRepository.createProduct({
      ...dto,
      tenantId: TenantContext.getTenantId(),
      originalPrice: dto.originalPrice ?? null,
      imageBg: dto.imageBg ?? null,
      imageEmoji: dto.imageEmoji ?? null,
      metadata: dto.metadata ?? null,
    });
    return this.storeRepository.saveProduct(product);
  }

  listProducts() {
    return this.storeRepository.listProducts(TenantContext.getTenantId());
  }

  listOrders() {
    return this.storeRepository.listOrders(TenantContext.getTenantId());
  }

  async checkout(userId: string, dto: CreateOrderDto) {
    const tenantId = TenantContext.getTenantId();
    const user = await this.usersRepository.findOne({ id: userId, tenantId, isActive: true });
    if (!user) throw new NotFoundException('User not found in this tenant.');

    const subscription = await this.subscriptionsRepository.findSubscription({ userId, tenantId, status: 'active' });
    const queryRunner = this.storeRepository.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let subtotal = 0;
      const orderItems: OrderItem[] = [];

      for (const itemDto of dto.items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: itemDto.productId, tenantId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!product) throw new NotFoundException(`Product ${itemDto.productId} not found.`);
        if (product.stock < itemDto.quantity) {
          throw new BadRequestException(`Insufficient stock for product ${product.name}.`);
        }

        product.stock -= itemDto.quantity;
        await queryRunner.manager.save(product);

        const movement = new StockMovement();
        movement.productId = product.id;
        movement.quantity = -itemDto.quantity;
        movement.type = 'sale';
        movement.tenantId = tenantId;
        movement.reason = 'Checkout sale';
        await queryRunner.manager.save(movement);

        const orderItem = new OrderItem();
        orderItem.productId = product.id;
        orderItem.quantity = itemDto.quantity;
        orderItem.price = product.price;
        orderItem.tenantId = tenantId;
        subtotal += Number(product.price) * itemDto.quantity;
        orderItems.push(orderItem);
      }

      const discountRate = Number(subscription?.plan?.storeDiscount ?? 0);
      const total = discountRate > 0 ? subtotal * (1 - discountRate) : subtotal;

      const order = new Order();
      order.userId = user.id;
      order.number = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      order.status = 'Separando';
      order.total = Number(total.toFixed(2));
      order.tenantId = tenantId;
      order.items = orderItems;

      const saved = await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
      return saved;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async adjustStockManual(adminId: string, dto: AdjustStockDto) {
    const tenantId = TenantContext.getTenantId();
    const product = await this.storeRepository.findProduct({ id: dto.productId, tenantId });
    if (!product) throw new NotFoundException('Product not found in this tenant.');

    const queryRunner = this.storeRepository.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const previousStock = product.stock;
      let difference = 0;
      if (dto.type === 'manual_adjustment') {
        difference = dto.quantity - previousStock;
        product.stock = dto.quantity;
      } else if (dto.type === 'replenishment') {
        difference = dto.quantity;
        product.stock += dto.quantity;
      } else {
        difference = -dto.quantity;
        product.stock = Math.max(0, product.stock - dto.quantity);
      }

      const updated = await queryRunner.manager.save(product);
      const movement = this.storeRepository.createMovement({
        productId: product.id,
        userId: adminId,
        quantity: difference,
        type: dto.type,
        reason: dto.reason,
        tenantId,
      });
      await queryRunner.manager.save(movement);
      await queryRunner.commitTransaction();
      return updated;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
