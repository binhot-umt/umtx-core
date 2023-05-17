import { IsNotEmpty } from 'class-validator';

export class StartWritingDto {
  @IsNotEmpty({ message: 'TASK_NOT_EMPTY' })
  task: string;

  @IsNotEmpty({ message: 'MODE_NOT_EMPTY' })
  mode: string;

  @IsNotEmpty({ message: 'COLLECTION_NOT_EMPTY' })
  collection_type: string;

  @IsNotEmpty({ message: 'TOPIC_NOT_EMPTY' })
  topic: string;
  @IsNotEmpty({ message: 'TYPE_NOT_EMPTY' })
  type: string;
}
