import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Veterinarian } from './entities/veterinarian.entity';

@Injectable()
export class VeterinariansRepository {
  constructor(
    @InjectRepository(Veterinarian)
    private readonly repository: Repository<Veterinarian>,
  ) {}

  create(data: Partial<Veterinarian>) {
    return this.repository.create(data);
  }

  save(vet: Veterinarian) {
    return this.repository.save(vet);
  }

  findOne(where: FindOptionsWhere<Veterinarian>) {
    return this.repository.findOne({ where });
  }

  list(tenantId: string) {
    return this.repository.find({ where: { tenantId, isActive: true }, order: { name: 'ASC' } });
  }
}
