import { Module } from '@nestjs/common';
import { WritingService } from './writing.service';
import { WritingController } from './writing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WritingSchema } from './schemas/writing.schema';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Writing', schema: WritingSchema, collection: 'WritingPost' },
    ]),
    BullModule.registerQueue({
      name: 'writing',
    }),
  ],
  controllers: [WritingController],
  providers: [WritingService],
})
export class WritingModule {}
