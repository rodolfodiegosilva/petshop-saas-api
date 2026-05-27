import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TenantContext } from '../../common/middleware/tenant-context';
import { AuthRepository } from './auth.repository';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const tenantId = TenantContext.getTenantId();
    const user = await this.authRepository.findUserForLogin(dto.email, tenantId);
    if (!user) throw new UnauthorizedException('Invalid credentials.');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new UnauthorizedException('Invalid credentials.');

    const payload = {
      sub: user.id,
      tenantId,
      email: user.email,
      role: user.role,
      clientType: dto.clientType,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId,
      },
    };
  }
}
