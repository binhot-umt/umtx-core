import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TopicDocument } from './schemas/topic.schema';
import { Topic } from './entities/topic.entity';

@Injectable()
export class TopicsService {
  constructor(
    @InjectModel('Topics') private readonly topicModel: Model<TopicDocument>,
  ) {}
  create(createTopicDto: CreateTopicDto) {
    const newTopic = new this.topicModel(createTopicDto);
    const result = newTopic.save();
    return result;
  }
  importAllData(data) {
    const list = data;

    list.forEach((item) => {
      item.topic = [...new Set(item.topic.split(';'))];
      item.task_description = item.task_description
        .replace('‚Äú', '"')
        .replace('‚Äò', '"')
        .replace('‚Äô', '"')
        .replace('?', ' ? ')
        .replace('‚Äù', '"')
        .replace(/\s+/g, ' ')
        .trim();
      this.create(item);
    });
  }

  findAll() {
    return this.topicModel.find().exec();
  }

  findOne(id: string) {
    return this.topicModel.findOne({ _id: id }).exec();
  }

  getAllCollection() {
    return this.topicModel.distinct('collection_type').exec();
  }

  getAllTopic() {
    return this.topicModel.distinct('topic').exec();
  }

  getAllType() {
    return this.topicModel.distinct('type').exec();
  }
}
