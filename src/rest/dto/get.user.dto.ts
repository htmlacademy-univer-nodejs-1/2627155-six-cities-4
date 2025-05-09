import { UserType } from '../../types/user.js';

export class GetUserDto {
  id!: string;
  name!: string;
  email!: string;
  profilePicture?: string;
  type!: UserType;
}
