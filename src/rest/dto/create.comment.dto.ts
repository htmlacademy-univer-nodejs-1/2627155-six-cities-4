import { IsString, MinLength, MaxLength, IsInt, Min, Max } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(5)
  @MaxLength(1024)
  text!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;
}
