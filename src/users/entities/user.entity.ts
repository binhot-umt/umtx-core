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
import { BaseSchema } from 'src/utils/base.schema';
import { v4 as uuidv4 } from 'uuid';
export enum UserStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  UNCONFIRMED = 'Unconfirmed',
  DELETED = 'Deleted',
}
@Schema()
export class User extends BaseSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({
    required: true,
    enum: UserStatus,
    type: String,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Prop({ required: true, default: ['USERS'] })
  roles: string[];

  @Prop({ select: false })
  password: string;

  @Prop({ required: true, default: '-', select: false })
  sessionId: string;

  @Prop({ required: true, default: new Date(), select: false })
  lastLogin: Date;
}
