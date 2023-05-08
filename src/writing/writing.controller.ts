import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Request,
  UseGuards,
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
  @Post('start')
  create(@Body() startWriting: StartWritingDto, @Request() req) {
    return this.writingService.startWriting(startWriting, req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.writingService.findAll(req._id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.writingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWritingDto: UpdateWritingDto) {
    return this.writingService.update(id, updateWritingDto);
  }
}
