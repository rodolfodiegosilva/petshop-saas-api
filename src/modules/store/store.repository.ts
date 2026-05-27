import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from './entities/product.entity';
import { StockMovement } from './entities/stock-movement.entity';

@Injectable()
export class StoreRepository {
  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(StockMovement)
    private readonly movements: Repository<StockMovement>,
    private readonly dataSource: DataSource,
  ) {}

  createProduct(data: Partial<Product>) {
    return this.products.create(data);
  }

  saveProduct(product: Product) {
    return this.products.save(product);
  }

  findProduct(where: FindOptionsWhere<Product>) {
    return this.products.findOne({ where });
  }

  listProducts(tenantId: string) {
    return this.products.find({ where: { tenantId }, order: { name: 'ASC' } });
  }

  listOrders(tenantId: string) {
    return this.orders.find({ where: { tenantId }, relations: ['items', 'items.product', 'user'], order: { createdAt: 'DESC' } });
  }

  createQueryRunner() {
    return this.dataSource.createQueryRunner();
  }

  createMovement(data: Partial<StockMovement>) {
    return this.movements.create(data);
  }
}
