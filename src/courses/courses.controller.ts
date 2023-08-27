import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  create(@Query('key') key, @Query('suid') suid) {
    // return this.coursesService.create(createCourseDto);
    return;
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  findMe(@Request() payload: any) {
    console.log('payload', payload.user);
    return this.coursesService.find_me(payload.user.uid, payload.user.token);
  }

  @Get('ic')
  ical(@Query('s') s: any, @Res() res: any) {
    console.log('s', s);
    return this.coursesService.ical(s, res);
  }

  @Post('fetch_calendar')
  @UseGuards(JwtAuthGuard)
  createMass(@Request() payload: any) {
    return this.coursesService.fetch_calendar(
      payload.user.uid,
      payload.user.token,
    );
  }
}
