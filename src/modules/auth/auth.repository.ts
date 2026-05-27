import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AuthRepository {
  constructor(private readonly usersRepository: UsersRepository) {}

  findUserForLogin(email: string, tenantId: string) {
    return this.usersRepository.findByEmailForAuth(email, tenantId);
  }
}
