import { IsNotEmpty } from 'class-validator';

export class CreateTopicDto {
  @IsNotEmpty()
  year: string;
  @IsNotEmpty()
  month: string;
  @IsNotEmpty()
  collection_type: string;

  @IsNotEmpty()
  cert: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  task: string;

  @IsNotEmpty()
  topic: string[];

  @IsNotEmpty()
  task_description: string;
}
