import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';

@Injectable()
export class AppointmentsRepository {
  constructor(
    @InjectRepository(Appointment)
    private readonly repository: Repository<Appointment>,
  ) {}

  create(data: Partial<Appointment>) {
    return this.repository.create(data);
  }

  save(appointment: Appointment) {
    return this.repository.save(appointment);
  }

  findOne(where: FindOptionsWhere<Appointment>) {
    return this.repository.findOne({ where });
  }

  list(tenantId: string) {
    return this.repository.find({
      where: { tenantId },
      relations: ['pet', 'tutor', 'veterinarian'],
      order: { date: 'DESC', time: 'DESC' },
    });
  }
}
