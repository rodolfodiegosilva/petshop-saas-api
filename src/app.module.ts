import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { validate } from './config/env.validation';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { PetsModule } from './modules/pets/pets.module';
import { VeterinariansModule } from './modules/veterinarians/veterinarians.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { MedicalRecordsModule } from './modules/medical-records/medical-records.module';
import { StoreModule } from './modules/store/store.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { FeatureFlagsModule } from './modules/feature-flags/feature-flags.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`env/.env.${process.env.APP_ENV || 'local'}`, 'env/.env.local', '.env'],
      validate,
    }),
    TypeOrmModule.forRootAsync({ useFactory: databaseConfig }),
    TenantsModule,
    AuthModule,
    UsersModule,
    PetsModule,
    VeterinariansModule,
    AppointmentsModule,
    MedicalRecordsModule,
    StoreModule,
    PaymentsModule,
    SubscriptionsModule,
    FeatureFlagsModule,
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'health', method: RequestMethod.ALL },
        { path: 'tenants', method: RequestMethod.POST },
        { path: 'tenants/config', method: RequestMethod.GET },
        { path: 'payments/webhook', method: RequestMethod.POST },
      )
      .forRoutes({ path: '{*path}', method: RequestMethod.ALL });
  }
}
