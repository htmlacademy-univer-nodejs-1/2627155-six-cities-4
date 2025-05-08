import { UserType } from '../../types/index.js';

export class CreateUserDto {
  name!: string;
  email!: string;
  password!: string;
  profilePicture?: string;
  type!: UserType;
}
