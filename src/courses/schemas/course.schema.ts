import { SchemaFactory } from '@nestjs/mongoose';
import { Course } from '../entities/course.entity';

export type CourseDocument = Course & Document;

export const CourseSchema = SchemaFactory.createForClass(Course);
