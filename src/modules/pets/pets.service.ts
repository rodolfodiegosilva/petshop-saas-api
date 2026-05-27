import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TenantContext } from '../../common/middleware/tenant-context';
import { SubscriptionsRepository } from '../subscriptions/subscriptions.repository';
import { UsersRepository } from '../users/users.repository';
import { ApplyVaccineDto } from './dto/apply-vaccine.dto';
import { CreatePetDto } from './dto/create-pet.dto';
import { PetsRepository } from './pets.repository';

@Injectable()
export class PetsService {
  constructor(
    private readonly petsRepository: PetsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async create(tutorId: string, dto: CreatePetDto) {
    const tenantId = TenantContext.getTenantId();
    const tutor = await this.usersRepository.findOne({ id: tutorId, tenantId, isActive: true });
    if (!tutor) throw new NotFoundException('Tutor not found in this tenant.');

    const activeSub = await this.subscriptionsRepository.findSubscription({ userId: tutorId, tenantId, status: 'active' });
    const allowedLimit = activeSub?.plan?.petLimit ?? 1;
    const currentCount = await this.petsRepository.count({ tutorId, tenantId });
    if (currentCount >= allowedLimit) {
      throw new BadRequestException(`Pet limit reached for this subscription (${allowedLimit}).`);
    }

    const species = dto.species.toLowerCase().trim();
    if ((species === 'peixe' || species === 'fish') && dto.weight > 2) {
      throw new BadRequestException('Biosecurity rule failed: ornamental fish weight is incompatible.');
    }

    const pet = this.petsRepository.create({
      ...dto,
      tutorId,
      tenantId,
      vaccines: [],
      metadata: dto.metadata ?? null,
    });
    return this.petsRepository.save(pet);
  }

  listByTutor(tutorId: string) {
    return this.petsRepository.listByTutor(tutorId, TenantContext.getTenantId());
  }

  async applyVaccine(petId: number, dto: ApplyVaccineDto) {
    const tenantId = TenantContext.getTenantId();
    const pet = await this.petsRepository.findOne({ id: petId, tenantId });
    if (!pet) throw new NotFoundException('Pet not found in this tenant.');

    const species = pet.species.toLowerCase().trim();
    const allowed = species === 'cão' || species === 'cao' || species === 'dog'
      ? ['V10', 'Antirrábica', 'Giárdia']
      : species === 'gato' || species === 'cat'
        ? ['V4', 'Antirrábica']
        : [];

    if (!allowed.includes(dto.vaccineName)) {
      throw new BadRequestException(`Vaccine ${dto.vaccineName} is not allowed for species ${pet.species}.`);
    }

    pet.vaccines = pet.vaccines ?? [];
    if (!pet.vaccines.includes(dto.vaccineName)) pet.vaccines.push(dto.vaccineName);
    return this.petsRepository.save(pet);
  }
}
