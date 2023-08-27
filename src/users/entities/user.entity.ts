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
}

export enum SIS_STATUS {
  ACTIVE = 'Active',
  WRONG_LOGIN = 'Wrong login',
  INACTIVE = 'Inactive',
  HANDLING = 'Handling',
}
@Schema({ versionKey: false })
export class User extends BaseSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: String, required: true, default: 0 })
  phone: string;

  @Prop({
    required: true,
    type: String,
    default:
      'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
  })
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

  @Prop({ select: true })
  password: string;

  @Prop({ required: true, default: '-', select: true })
  sessionId: string;

  @Prop({ required: true, default: '-', select: true })
  sis_token: string;
  @Prop({ required: true, default: '-', select: true })
  suid: string;
  @Prop({ required: true, default: '-', select: true })
  puid: string;

  @Prop({
    required: true,
    enum: SIS_STATUS,
    default: SIS_STATUS.INACTIVE,
    select: true,
  })
  sis_status: SIS_STATUS;
  @Prop({ required: true, default: new Date(0), select: true })
  sis_token_expire: Date;

  @Prop({ required: true, default: new Date(), select: false })
  lastLogin: Date;
}
