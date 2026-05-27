import { ConflictException, Injectable } from '@nestjs/common';
import { TenantContext } from '../../common/middleware/tenant-context';
import { CreateVeterinarianDto } from './dto/create-veterinarian.dto';
import { VeterinariansRepository } from './veterinarians.repository';

@Injectable()
export class VeterinariansService {
  constructor(private readonly veterinariansRepository: VeterinariansRepository) {}

  async create(dto: CreateVeterinarianDto) {
    const tenantId = TenantContext.getTenantId();
    const existing = await this.veterinariansRepository.findOne({ tenantId, crmv: dto.crmv });
    if (existing) throw new ConflictException('CRMV already exists in this tenant.');

    const vet = this.veterinariansRepository.create({
      ...dto,
      tenantId,
      status: dto.status ?? 'Disponível',
      metadata: dto.metadata ?? null,
    });
    return this.veterinariansRepository.save(vet);
  }

  list() {
    return this.veterinariansRepository.list(TenantContext.getTenantId());
  }
}
