import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecord } from './entities/medical-record.entity';

@Injectable()
export class MedicalRecordsRepository {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly repository: Repository<MedicalRecord>,
  ) {}

  create(data: Partial<MedicalRecord>) {
    return this.repository.create(data);
  }

  save(record: MedicalRecord) {
    return this.repository.save(record);
  }

  listByPet(petId: number, tenantId: string) {
    return this.repository.find({
      where: { petId, tenantId },
      relations: ['pet', 'veterinarian'],
      order: { date: 'DESC' },
    });
  }
}
