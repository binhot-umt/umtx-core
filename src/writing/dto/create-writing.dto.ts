import { IsNotEmpty } from 'class-validator';

export class CreateWritingDto {
  @IsNotEmpty()
  user_id: string;
  @IsNotEmpty()
  essay: string;
  @IsNotEmpty()
  result: string;
}
