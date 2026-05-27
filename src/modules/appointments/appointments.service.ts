import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantContext } from '../../common/middleware/tenant-context';
import { PetsRepository } from '../pets/pets.repository';
import { UsersRepository } from '../users/users.repository';
import { VeterinariansRepository } from '../veterinarians/veterinarians.repository';
import { AppointmentsRepository } from './appointments.repository';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
    private readonly petsRepository: PetsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly veterinariansRepository: VeterinariansRepository,
  ) {}

  async create(dto: CreateAppointmentDto) {
    const tenantId = TenantContext.getTenantId();
    const [pet, tutor] = await Promise.all([
      this.petsRepository.findOne({ id: dto.petId, tenantId }),
      this.usersRepository.findOne({ id: dto.tutorId, tenantId, isActive: true }),
    ]);
    if (!pet) throw new NotFoundException('Pet not found in this tenant.');
    if (!tutor) throw new NotFoundException('Tutor not found in this tenant.');

    if (dto.veterinarianId) {
      const vet = await this.veterinariansRepository.findOne({ id: dto.veterinarianId, tenantId, isActive: true });
      if (!vet) throw new NotFoundException('Veterinarian not found in this tenant.');
    }

    const appointment = this.appointmentsRepository.create({
      ...dto,
      date: new Date(dto.date),
      tenantId,
      status: 'Em análise',
      metadata: dto.metadata ?? null,
    });
    return this.appointmentsRepository.save(appointment);
  }

  list() {
    return this.appointmentsRepository.list(TenantContext.getTenantId());
  }
}
