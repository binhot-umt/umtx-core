import { SchemaFactory } from '@nestjs/mongoose';
import { Writing } from '../entities/writing.entity';

export type WritingDocument = Writing & Document;

export const WritingSchema = SchemaFactory.createForClass(Writing);
