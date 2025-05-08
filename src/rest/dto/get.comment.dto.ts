import { GetUserDto } from './get.user.dto.js';

export class GetCommentDto {
  text!: string;
  createdAt!: Date;
  rating!: number;
  author!: GetUserDto;
}

