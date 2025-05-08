import { UserType } from '../../types/index.js';

export class GetUserDto {
  name!: string;
  email!: string;
  profilePicture?: string;
  type!: UserType;
}
