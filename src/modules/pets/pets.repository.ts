import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Pet } from './entities/pet.entity';

@Injectable()
export class PetsRepository {
  constructor(
    @InjectRepository(Pet)
    private readonly repository: Repository<Pet>,
  ) {}

  create(data: Partial<Pet>) {
    return this.repository.create(data);
  }

  save(pet: Pet) {
    return this.repository.save(pet);
  }

  findOne(where: FindOptionsWhere<Pet>) {
    return this.repository.findOne({ where });
  }

  count(where: FindOptionsWhere<Pet>) {
    return this.repository.count({ where });
  }

  listByTutor(tutorId: string, tenantId: string) {
    return this.repository.find({ where: { tutorId, tenantId }, order: { id: 'DESC' } });
  }
}
