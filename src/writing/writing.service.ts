import { Injectable } from '@nestjs/common';
import { CreateWritingDto } from './dto/create-writing.dto';
import { UpdateWritingDto } from './dto/update-writing.dto';
import { InjectModel } from '@nestjs/mongoose';
import { WritingDocument } from './schemas/writing.schema';
import { Model } from 'mongoose';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class WritingService {
  constructor(
    @InjectModel('Writing')
    private readonly writingModel: Model<WritingDocument>,
    @InjectQueue('writing') private writingQueue: Queue,
  ) {}
  async create(createWritingDto: CreateWritingDto) {
    const newWritingPost = new this.writingModel(createWritingDto);
    const newWritingPostResult = await newWritingPost.save();
    if (newWritingPost) {
      return { statusCode: 200, msg: 'SUCCESS', _id: newWritingPost.id };
    }
  }

  findAll(user_id: string) {
    return this.writingModel.find({ user_id: user_id }).exec();
  }

  findOne(id: string) {
    return this.writingModel.findOne({ _id: id }).exec();
  }

  update(id: string, updateWritingDto: UpdateWritingDto) {
    return this.writingModel.updateOne({ _id: id }, updateWritingDto).exec();
  }
}
