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

@Schema()
export class User {
  @Prop({ required: true, default: uuidv4 })
  _id: string;

  @Prop({ required: true })
  @IsEmail()
  email: string;

  @Prop({ required: true })
  @IsPhoneNumber('VN')
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: '-' })
  token: string;

  @Prop({ required: true, default: new Date(0) })
  lastLogin: Date;
}
