import { IsNotEmpty } from 'class-validator';

export class StartWritingDto {
  @IsNotEmpty({ message: 'TASK_NOT_EMPTY' })
  task: string;

  @IsNotEmpty({ message: 'MODE_NOT_EMPTY' })
  mode: string;
}
