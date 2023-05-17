import { Module } from '@nestjs/common';
import { WritingService } from './writing.service';
import { WritingController } from './writing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WritingSchema } from './schemas/writing.schema';
import { BullModule } from '@nestjs/bull';
import { UserSchema } from 'src/users/schemas/user.schema';
import { UtilsService } from 'src/utils/utils.service';
import { WritingQueueService } from './writing.queue';
import { MApiModule } from 'src/utils/master-api/mapi.module';
import { WritingProcessor } from './writing.processor';
import { WritingCronService } from './writing.cron';
import { TopicSchema } from 'src/topics/schemas/topic.schema';
import { TopicsModule } from 'src/topics/topics.module';
// import { MapiService } from 'src/utils/master-api/mapi.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Writing', schema: WritingSchema, collection: 'WritingPost' },
    ]),
    MongooseModule.forFeature([
      { name: 'Users', schema: UserSchema, collection: 'users' },
    ]),

    MongooseModule.forFeature([
      { name: 'Topics', schema: TopicSchema, collection: 'topic' },
    ]),
    BullModule.registerQueue({
      name: 'Writing',
    }),
    // WritingHandle,
    // LoggerService,
    MApiModule,
    TopicsModule,
  ],
  controllers: [WritingController],
  providers: [
    WritingService,
    UtilsService,
    WritingQueueService,
    WritingProcessor,
    WritingCronService,
  ],
  exports: [WritingService, WritingQueueService],
})
export class WritingModule {}
