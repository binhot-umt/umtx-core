import { v4 as uuidv4 } from 'uuid';

import { Prop, Schema } from '@nestjs/mongoose';
import { ValidateNested } from 'class-validator';

export class Log {
  @Prop({ required: true, default: 'INFO' })
  type: string;
  @Prop({ required: true, default: '-' })
  message: string;
  @Prop({ required: true, default: '-' })
  code: string;
  @Prop({ required: true, default: () => new Date() })
  time: Date;
}
@Schema()
export abstract class BaseSchema {
  @Prop({
    index: true,
    required: true,
    unique: true,
    default: (): string => {
      return uuidv4();
    },
  })
  _id!: string;

  @Prop({
    required: true,
    default: Date.now,
    select: false,
  })
  createdAt: Date;

  @Prop({
    required: true,
    default: Date.now,
    select: false,
  })
  updatedAt: Date;

  @Prop({
    required: true,
    default: { type: 'INFO', message: 'Created', code: 'CREATED' },
  })
  @ValidateNested()
  log: [Log];
}
