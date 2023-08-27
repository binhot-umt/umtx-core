import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema } from './schemas/course.schema';
import { UtilsService } from 'src/utils/utils.service';
import { MApiModule } from 'src/utils/master-api/mapi.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Courses', schema: CourseSchema, collection: 'courses' },
    ]),
    MApiModule,
  ],
  controllers: [CoursesController],
  providers: [UtilsService, CoursesService],
})
export class CoursesModule {}
