import { IsEnum, IsNotEmpty } from 'class-validator';
import { WritingMode, writingTask } from '../entities/writing.status.enum';

export class CreateWritingDto {
  topic_id: string;

  @IsNotEmpty({ message: 'MODE_NOT_EMPTY' })
  @IsEnum(WritingMode)
  mode: WritingMode;

  @IsNotEmpty({ message: 'TASK_NOT_EMPTY' })
  @IsEnum(writingTask)
  task: writingTask;
}
