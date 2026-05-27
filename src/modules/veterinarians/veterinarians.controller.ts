import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../auth/enums/role.enum';
import { CreateVeterinarianDto } from './dto/create-veterinarian.dto';
import { VeterinariansService } from './veterinarians.service';

@Controller('veterinarians')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VeterinariansController {
  constructor(private readonly veterinariansService: VeterinariansService) {}

  @Get()
  @Roles(Role.ADMIN, Role.CLIENT, Role.VETERINARIAN)
  list() {
    return this.veterinariansService.list();
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateVeterinarianDto) {
    return this.veterinariansService.create(dto);
  }
}
