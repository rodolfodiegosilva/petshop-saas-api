import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { UsersModule } from '../users/users.module';
import { Pet } from './entities/pet.entity';
import { PetsController } from './pets.controller';
import { PetsRepository } from './pets.repository';
import { PetsService } from './pets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pet]), UsersModule, SubscriptionsModule],
  controllers: [PetsController],
  providers: [PetsService, PetsRepository],
  exports: [PetsRepository, PetsService, TypeOrmModule],
})
export class PetsModule {}
