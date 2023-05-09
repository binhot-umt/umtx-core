import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWritingDto } from './dto/create-writing.dto';
import { UpdateWritingDto } from './dto/update-writing.dto';
import { InjectModel } from '@nestjs/mongoose';
import { WritingDocument } from './schemas/writing.schema';
import { Model } from 'mongoose';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { StartWritingDto } from './dto/start-writing.dto';
import { WritingStatus } from './entities/writing.status.enum';
import { Penalty, TaskMinutes } from 'src/utils/hard.config';
import { NotFoundError } from 'rxjs';
import { UtilsService } from 'src/utils/utils.service';
import { ok } from 'assert';

@Injectable()
export class WritingService {
  constructor(
    private readonly utilsService: UtilsService,
    @InjectModel('Writing')
    private readonly writingModel: Model<WritingDocument>,
    @InjectQueue('writing') private writingQueue: Queue,
  ) {}
  async updateResult(
    post_id: string,
    ieltsScore,
    getfeedbackGrammar,
    getFeedbackStructure,
    structureAnalyst,
  ) {
    const updateResult = await this.writingModel.updateOne(
      { _id: post_id },
      {
        ieltsScore: ieltsScore,
        grammarFeedback: getfeedbackGrammar,

        structureFeedback: getFeedbackStructure,

        structure: structureAnalyst,
        status: WritingStatus.Finish,
      },
    );
    return updateResult.modifiedCount > 0;
  }
  async setFailed(id): Promise<void> {
    await this.writingModel.updateOne(
      { _id: id },
      { status: WritingStatus.Failed },
    );
  }
  async create(createWritingDto: CreateWritingDto) {
    const newWritingPost = new this.writingModel(createWritingDto);
    const newWritingPostResult = await newWritingPost.save();
    if (newWritingPost) {
      return { statusCode: 200, message: 'SUCCESS', _id: newWritingPost.id };
    }
  }

  async startWriting(start: StartWritingDto, user: any) {
    // console.log('start, user', start, user);
    // const writingTask = new this.writingModel({});
    const writingPost = {
      owner: user.id,
      ...start,
    };
    // console.log('writingPost', writingPost);
    const newWritingPost = new this.writingModel(writingPost);
    const newWritingPostResult = await newWritingPost.save();
    if (newWritingPost) {
      const UpdateStatus = await this.writingModel
        .updateOne({ _id: newWritingPost.id }, { status: WritingStatus.Draft })
        .exec();
      return {
        statusCode: 200,
        message: 'SUCCESS',
        _id: newWritingPost.id,
        data: newWritingPostResult,
      };
    } else {
      throw new BadGatewayException('CAN_NOT_CREATE_WRITING_POST');
    }
  }
  async startTimerOnWrite(id: string, user_id: string) {
    const getPost = await this.writingModel
      .findOne({ _id: id, owner: user_id })
      .exec();
    if (!getPost) {
      throw new NotFoundException('WRITING_POST_NOT_FOUND');
    }
    if (getPost.status == WritingStatus.Draft) {
      const eventStartTimer = await this.writingModel
        .updateOne(
          { _id: id, owner: user_id },
          {
            status: WritingStatus.Writing,
            endTime:
              new Date().getTime() +
              TaskMinutes[getPost.task][0] * 60 * 60 * 1000 +
              TaskMinutes[getPost.task][1] * 60 * 1000 +
              TaskMinutes[getPost.task][2] * 1000,
            $currentDate: { startTime: true, lastModified: true },
            $push: {
              log: {
                type: 'INFO',
                message: 'Start timer',
                code: 'TIMER_STARTED',
              },
            },
          },
        )
        .exec();
      if (eventStartTimer) {
        return {
          statusCode: 200,
          message: 'SUCCESS',
          data: { time_stated: new Date(), length: TaskMinutes[getPost.task] },
        };
      } else {
        throw new BadGatewayException('CAN_NOT_START_TIMER');
      }
    } else {
      throw new BadRequestException({
        statusCode: 400,
        message: 'WRITING_POST_ALREADY_STARTED',
        data: {
          time_lefted: Number(getPost.endTime) - Number(new Date()),
        },
      });
    }
  }
  async submittedWriting(id: string, user_id: string, content: string) {
    const getPost = await this.writingModel
      .findOne({ _id: id, owner: user_id })
      .exec();

    if (!getPost) {
      throw new NotFoundException('WRITING_POST_NOT_FOUND');
    }
    if (getPost.status == WritingStatus.Writing) {
      if (
        Number(getPost.endTime) - Number(new Date()) >
        this.utilsService.buildToTimer(Penalty)
      ) {
        const updateContentAndSubmit = await this.writingModel.updateOne(
          {
            _id: id,
            owner: user_id,
          },
          {
            content: content,
            status: WritingStatus.Submitted,
            $push: {
              log: {
                type: 'INFO',
                message: 'Submitted writing',
                code: 'SUBMITTED',
              },
            },
          },
        );
        await this.writingQueue.add(id);
        return {
          statusCode: 200,
          message: 'SUCCESS',
          data: {
            endTime: new Date(),
          },
        };
      } else {
        throw new BadRequestException('TOO_LATE_TO_SUBMIT');
      }
    } else {
      throw new BadRequestException('NOT_RIGHT_TIME_TO_SUBMIT');
    }
  }
  adminGetOneId(id: string) {
    return this.writingModel.findOne({ _id: id }).exec();
  }
  findAll(user_id: string) {
    return this.writingModel.find({ owner: user_id }).exec();
  }

  findOne(id: string, user_id: string) {
    return this.writingModel.findOne({ _id: id, owner: user_id }).exec();
  }

  update(id: string, updateWritingDto: UpdateWritingDto) {
    return this.writingModel.updateOne({ _id: id }, updateWritingDto).exec();
  }
}
