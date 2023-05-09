import { Types } from 'mongoose';
import { BaseSchema } from './base.schema';
import { Prop } from '@nestjs/mongoose';

export class Ownerful extends BaseSchema {
  @Prop({ type: Types.ObjectId, ref: 'Users' })
  owner?: string;
}
