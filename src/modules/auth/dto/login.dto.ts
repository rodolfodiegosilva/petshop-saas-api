import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';

export type ClientType = 'tutor_mobile' | 'staff_admin' | 'vet_portal' | 'public_web';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsIn(['tutor_mobile', 'staff_admin', 'vet_portal', 'public_web'])
  clientType: ClientType;
}
