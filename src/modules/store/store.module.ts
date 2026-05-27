import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { UsersModule } from '../users/users.module';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { Product } from './entities/product.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { StoreController } from './store.controller';
import { StoreRepository } from './store.repository';
import { StoreService } from './store.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Order, OrderItem, StockMovement]), UsersModule, SubscriptionsModule],
  controllers: [StoreController],
  providers: [StoreService, StoreRepository],
  exports: [StoreRepository, StoreService, TypeOrmModule],
})
export class StoreModule {}
