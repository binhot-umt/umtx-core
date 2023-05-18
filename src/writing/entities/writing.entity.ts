import { Prop, Schema } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { WritingMode, WritingStatus, writingTask } from './writing.status.enum';
import { Ownerful } from 'src/utils/owner.schema';
import { Types } from 'mongoose';
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
export class IELTS_Rewrite {
  @Prop({ required: true })
  ideas: string;

  @Prop({ required: true })
  improvement: string;

  @Prop({ required: true })
  essay: string;

  @Prop({ required: true, default: [] })
  structure: [any];

  @Prop({ required: true, type: IELTSScore })
  ielts_score: IELTSScore;
}

@Schema({ versionKey: false })
export class Writing extends Ownerful {
  @Prop({ default: '' })
  content: string;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Topics' })
  topicId: string;

  @Prop({ required: false })
  topicContent: string;

  @Prop({ required: false })
  topicImg: string;

  @Prop({ required: true, default: WritingStatus.New, enum: WritingStatus })
  status: WritingStatus;

  @Prop({ required: true, default: WritingMode.Practice, enum: WritingMode })
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

  @Prop()
  @ValidateNested({ each: true })
  @Type(() => IELTS_Rewrite)
  ieltsRewrite: IELTS_Rewrite;
}
