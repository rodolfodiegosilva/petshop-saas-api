import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetsModule } from '../pets/pets.module';
import { VeterinariansModule } from '../veterinarians/veterinarians.module';
import { MedicalRecord } from './entities/medical-record.entity';
import { MedicalRecordsController } from './medical-records.controller';
import { MedicalRecordsRepository } from './medical-records.repository';
import { MedicalRecordsService } from './medical-records.service';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecord]), PetsModule, VeterinariansModule],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService, MedicalRecordsRepository],
  exports: [MedicalRecordsRepository, MedicalRecordsService, TypeOrmModule],
})
export class MedicalRecordsModule {}
