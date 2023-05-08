import { Prop, Schema } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { WritingStatus } from './writing.status.enum';
import { BaseSchema } from 'src/utils/base.schema';

export class Writing extends BaseSchema {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  topic_id: string;

  @Prop({ required: true })
  topic_content: string;

  @Prop()
  topic_img: string;

  @Prop({ required: true })
  status: WritingStatus;

  @Prop({
    required: true,
    default: () => {
      return new Date().toISOString;
    },
  })
  created_date: Date;
  @Prop({
    required: true,
    default: () => {
      return new Date().toISOString;
    },
  })
  last_modified: Date;
  @Prop()
  feedback: [any];
  @Prop()
  grammarMistakes: [string];
  @Prop()
  vocabularyMistakes: [string];
}
