import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantContext } from '../../common/middleware/tenant-context';
import { PetsRepository } from '../pets/pets.repository';
import { VeterinariansRepository } from '../veterinarians/veterinarians.repository';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { MedicalRecordsRepository } from './medical-records.repository';

@Injectable()
export class MedicalRecordsService {
  constructor(
    private readonly medicalRecordsRepository: MedicalRecordsRepository,
    private readonly petsRepository: PetsRepository,
    private readonly veterinariansRepository: VeterinariansRepository,
  ) {}

  async create(dto: CreateMedicalRecordDto) {
    const tenantId = TenantContext.getTenantId();
    const [pet, vet] = await Promise.all([
      this.petsRepository.findOne({ id: dto.petId, tenantId }),
      this.veterinariansRepository.findOne({ id: dto.veterinarianId, tenantId, isActive: true }),
    ]);
    if (!pet) throw new NotFoundException('Pet not found in this tenant.');
    if (!vet) throw new NotFoundException('Veterinarian not found in this tenant.');

    const record = this.medicalRecordsRepository.create({
      ...dto,
      tenantId,
      examsRequested: dto.examsRequested ?? [],
      recommendations: dto.recommendations ?? [],
      prescriptionItems: dto.prescriptionItems ?? [],
    });
    return this.medicalRecordsRepository.save(record);
  }

  listByPet(petId: number) {
    return this.medicalRecordsRepository.listByPet(petId, TenantContext.getTenantId());
  }
}
