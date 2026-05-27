import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  findOne(where: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
    return this.repository.findOne({ where });
  }

  async findByEmailForAuth(email: string, tenantId: string) {
    return this.repository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.subscription', 'subscription')
      .leftJoinAndSelect('subscription.plan', 'plan')
      .where('user.email = :email', { email })
      .andWhere('user.tenantId = :tenantId', { tenantId })
      .andWhere('user.isActive = true')
      .getOne();
  }

  create(data: Partial<User>) {
    return this.repository.create(data);
  }

  save(user: User) {
    return this.repository.save(user);
  }
}
