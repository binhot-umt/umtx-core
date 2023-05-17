import { SchemaFactory } from '@nestjs/mongoose';
import { Topic } from '../entities/topic.entity';

export type TopicDocument = Topic & Document;

export const TopicSchema = SchemaFactory.createForClass(Topic);
