import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicSchema } from './schemas/topic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Topics', schema: TopicSchema, collection: 'topic' },
    ]),
  ],
  controllers: [TopicsController],
  providers: [TopicsService],
  exports: [TopicsService],
})
export class TopicsModule {}
