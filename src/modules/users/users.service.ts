import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TenantContext } from '../../common/middleware/tenant-context';
import { Role } from '../auth/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(dto: CreateUserDto) {
    const tenantId = TenantContext.getTenantId();
    const existing = await this.usersRepository.findOne([
      { tenantId, email: dto.email },
      { tenantId, cpf: dto.cpf },
    ]);
    if (existing) throw new ConflictException('User email or CPF already exists in this tenant.');

    const user = this.usersRepository.create({
      ...dto,
      tenantId,
      role: dto.role ?? Role.CLIENT,
      metadata: dto.metadata ?? null,
    });
    return this.usersRepository.save(user);
  }

  async findByEmailForAuth(email: string, tenantId: string) {
    return this.usersRepository.findByEmailForAuth(email, tenantId);
  }

  async findOne(id: string) {
    const tenantId = TenantContext.getTenantId();
    const user = await this.usersRepository.findOne({ id, tenantId, isActive: true });
    if (!user) throw new NotFoundException('User not found in this tenant.');
    return user;
  }
}
