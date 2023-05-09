import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Request,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { WritingService } from './writing.service';
import { CreateWritingDto } from './dto/create-writing.dto';
import { UpdateWritingDto } from './dto/update-writing.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { StartWritingDto } from './dto/start-writing.dto';

@Controller('writing')
export class WritingController {
  constructor(private readonly writingService: WritingService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() startWriting: StartWritingDto, @Request() req) {
    return this.writingService.startWriting(startWriting, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/start')
  start(@Param('id', new ParseUUIDPipe()) uuid: string, @Request() req) {
    return this.writingService.startTimerOnWrite(uuid, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  submitted(
    @Param('id', new ParseUUIDPipe()) uuid: string,
    @Request() req,
    @Body('essay') essay: string,
  ) {
    return this.writingService.submittedWriting(uuid, req.user.id, essay);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    // console.log('req', req);
    return this.writingService.findAll(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.writingService.findOne(id, req.user.id);
  }
}
