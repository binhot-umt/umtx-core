import { Prop, Schema } from '@nestjs/mongoose';
import { BaseSchema } from 'src/utils/base.schema';

@Schema({ versionKey: false })
export class Topic extends BaseSchema {
  @Prop({ required: true })
  year: string;

  @Prop({ required: true })
  month: string;

  @Prop({ required: true })
  collection_type: string;

  @Prop({ required: true })
  cert: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  task: string;

  @Prop({ required: true })
  topic: string[];

  @Prop({ required: true })
  task_description: string;
}
