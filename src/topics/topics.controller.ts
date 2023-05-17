import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post('import')
  importAllData(@Body() bodyRequest: CreateTopicDto[]) {
    return this.topicsService.importAllData(bodyRequest);
  }
  @Get('all_detail')
  findAll() {
    return this.topicsService.findAll();
  }

  @Get('e_type')
  async getAllType() {
    return {
      statusCode: 200,
      message: 'SUCCESS',
      data: { e_type: await this.topicsService.getAllType() },
    };
  }
  @Get('e_topic')
  async getalltopic() {
    return {
      statusCode: 200,
      message: 'SUCCESS',
      data: { e_topic: await this.topicsService.getAllTopic() },
    };
  }
  @Get('collection')
  async findCollection() {
    return {
      statusCode: 200,
      message: 'SUCCESS',
      data: { collection_type: await this.topicsService.getAllCollection() },
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(id);
  }
}
