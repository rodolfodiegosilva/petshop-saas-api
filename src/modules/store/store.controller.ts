import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../auth/enums/role.enum';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { StoreService } from './store.service';

@Controller('store')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('products')
  @Roles(Role.ADMIN, Role.CLIENT, Role.VETERINARIAN)
  listProducts() {
    return this.storeService.listProducts();
  }

  @Post('products')
  @Roles(Role.ADMIN)
  createProduct(@Body() dto: CreateProductDto) {
    return this.storeService.createProduct(dto);
  }

  @Get('orders')
  @Roles(Role.ADMIN)
  listOrders() {
    return this.storeService.listOrders();
  }

  @Post('checkout/:userId')
  @Roles(Role.ADMIN, Role.CLIENT)
  checkout(@Param('userId') userId: string, @Body() dto: CreateOrderDto) {
    return this.storeService.checkout(userId, dto);
  }

  @Patch('stock')
  @Roles(Role.ADMIN)
  adjustStock(@CurrentUser() user: { id: string }, @Body() dto: AdjustStockDto) {
    return this.storeService.adjustStockManual(user.id, dto);
  }
}
