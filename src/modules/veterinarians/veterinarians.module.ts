import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Veterinarian } from './entities/veterinarian.entity';
import { VeterinariansController } from './veterinarians.controller';
import { VeterinariansRepository } from './veterinarians.repository';
import { VeterinariansService } from './veterinarians.service';

@Module({
  imports: [TypeOrmModule.forFeature([Veterinarian])],
  controllers: [VeterinariansController],
  providers: [VeterinariansService, VeterinariansRepository],
  exports: [VeterinariansRepository, VeterinariansService, TypeOrmModule],
})
export class VeterinariansModule {}
