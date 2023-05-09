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
import { WritingMode, WritingStatus, writingTask } from './writing.status.enum';
// import { BaseSchema } from 'src/utils/base.schema';
import { Ownerful } from 'src/utils/owner.schema';
@Schema({ versionKey: false })
export class IELTSScore {
  @Prop({ required: true })
  coherenceCohesion: number;

  @Prop({ required: true })
  grammaticalRangeAccuracy: number;

  @Prop({ required: true })
  lexicalResource: number;

  @Prop({ required: true })
  taskResponse: number;

  @Prop({ required: true })
  overall: number;
}
// @Schema()
@Schema({ versionKey: false })
export class Writing extends Ownerful {
  @Prop({ default: '' })
  content: string;

  @Prop({ required: false })
  topicId: string;

  @Prop({ required: false })
  topicContent: string;

  @Prop({ required: false })
  topicImg: string;

  @Prop({ required: true, default: WritingStatus.New, enum: WritingStatus })
  status: WritingStatus;

  @Prop({ required: true, default: WritingMode.Freemode, enum: WritingMode })
  mode: WritingMode;

  @Prop({ required: true, enum: writingTask })
  task: writingTask;

  @Prop({
    required: true,
    default: () => {
      return new Date(0);
    },
  })
  startTime: Date;

  @Prop({
    required: true,
    default: () => {
      return new Date(0);
    },
  })
  endTime: Date;

  @Prop({
    required: true,
    default: () => {
      return new Date(0);
    },
  })
  submittedTime: Date;
  @Prop({ required: true, default: [] })
  structure: [any];
  @Prop({ required: true, default: '-' })
  grammarFeedback: string;
  @Prop({ required: true, default: '-' })
  structureFeedback: string;

  @Prop()
  @ValidateNested({ each: true })
  @Type(() => IELTSScore)
  ieltsScore: IELTSScore;
}
