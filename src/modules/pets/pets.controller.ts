import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../auth/enums/role.enum';
import { ApplyVaccineDto } from './dto/apply-vaccine.dto';
import { CreatePetDto } from './dto/create-pet.dto';
import { PetsService } from './pets.service';

@Controller('pets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post(':tutorId')
  @Roles(Role.ADMIN, Role.CLIENT)
  create(@Param('tutorId') tutorId: string, @Body() dto: CreatePetDto) {
    return this.petsService.create(tutorId, dto);
  }

  @Get('tutor/:tutorId')
  @Roles(Role.ADMIN, Role.CLIENT, Role.VETERINARIAN)
  listByTutor(@Param('tutorId') tutorId: string) {
    return this.petsService.listByTutor(tutorId);
  }

  @Patch(':petId/vaccines')
  @Roles(Role.ADMIN, Role.VETERINARIAN)
  applyVaccine(@Param('petId') petId: number, @Body() dto: ApplyVaccineDto, @CurrentUser() _user: unknown) {
    return this.petsService.applyVaccine(Number(petId), dto);
  }
}
