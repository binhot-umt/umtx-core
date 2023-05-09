import { LoggerService, Module } from '@nestjs/common';
import { WritingService } from './writing.service';
import { WritingController } from './writing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WritingSchema } from './schemas/writing.schema';
import { BullModule } from '@nestjs/bull';
import { UserSchema } from 'src/users/schemas/user.schema';
import { UtilsService } from 'src/utils/utils.service';
import { WritingQueueService } from './writing.queue';
import { MApiModule } from 'src/utils/master-api/mapi.module';
// import { MapiService } from 'src/utils/master-api/mapi.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Writing', schema: WritingSchema, collection: 'WritingPost' },
    ]),
    MongooseModule.forFeature([
      { name: 'Users', schema: UserSchema, collection: 'users' },
    ]),
    BullModule.registerQueue({
      name: 'writing',
    }),
    // LoggerService,
    MApiModule,
  ],
  controllers: [WritingController],
  providers: [WritingService, UtilsService, WritingQueueService],
})
export class WritingModule {}
