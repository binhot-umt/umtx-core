import { v4 as uuidv4 } from 'uuid';

import { Prop } from '@nestjs/mongoose';

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
}
