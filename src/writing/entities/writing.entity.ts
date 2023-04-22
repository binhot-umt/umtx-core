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
export class Writing {
  @Prop({ required: true, default: uuidv4 })
  _id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  topic_id: string;

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
}
