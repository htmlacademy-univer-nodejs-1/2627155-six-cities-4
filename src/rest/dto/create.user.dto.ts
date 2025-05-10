import { IsString, IsEmail, IsOptional, MinLength, MaxLength, IsIn } from 'class-validator';
import { UserType } from '../../types/user.js';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(15)
    name!: string;

  @IsEmail()
    email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(12)
    password!: string;

  @IsIn(['ordinary', 'pro'])
    type!: UserType;
}
