import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWritingDto } from './dto/create-writing.dto';
import { InjectModel } from '@nestjs/mongoose';
import { WritingDocument } from './schemas/writing.schema';
import { Model } from 'mongoose';
import { StartWritingDto } from './dto/start-writing.dto';
import { WritingStatus } from './entities/writing.status.enum';
import { LateInStart, Penalty, TaskMinutes } from 'src/utils/hard.config';
import { UtilsService } from 'src/utils/utils.service';
import { WritingQueueService } from './writing.queue';

@Injectable()
export class WritingService {
  constructor(
    private readonly utilsService: UtilsService,
    @InjectModel('Writing')
    private readonly writingModel: Model<WritingDocument>,
    private writingQueue: WritingQueueService,
  ) {}
  async saveDraft(id: string, owner_id: string, content) {
    return (
      (
        await this.writingModel.updateOne(
          { _id: id, owner: owner_id },
          { content: content },
        )
      ).modifiedCount > 0
    );
  }
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
        status: WritingStatus.Finished,
      },
    );
    return updateResult.modifiedCount > 0;
  }
  async setFailed(id, reason = 'JOB_FAILED'): Promise<void> {
    await this.writingModel.updateOne(
      { _id: id },
      {
        status: WritingStatus.Failed,
        $push: {
          log: { type: 'ERROR', message: 'Job Failed', code: reason },
        },
      },
    );
  }
  async findAllProcessing() {
    return await this.writingModel
      .find({
        status: { $in: [WritingStatus.Processing, WritingStatus.Submitted] },
      })
      .exec();
  }
  async findAllTimeOut() {
    await this.writingModel
      .updateMany(
        {
          endTime: new Date(0),
          createdAt: {
            $lte: new Date(
              new Date().getTime() -
                this.utilsService.buildToTimer(LateInStart),
            ),
          },
          status: {
            $nin: [
              WritingStatus.Finished,
              WritingStatus.Processing,
              WritingStatus.Failed,

              WritingStatus.Submitted,
            ],
          },
        },
        {
          status: WritingStatus.Failed,
          $push: {
            log: {
              type: 'CRON',
              message: 'Set failed due to timeout',
              code: 'TIME_OUT_LIMIT',
            },
          },
        },
      )
      .exec();
    return await this.writingModel
      .updateMany(
        {
          endTime: { $ne: new Date(0), $lte: new Date() },
          status: {
            $nin: [
              WritingStatus.Finished,
              WritingStatus.Processing,
              WritingStatus.Failed,

              WritingStatus.Submitted,
            ],
          },
        },
        { status: WritingStatus.Failed },
      )
      .exec();
  }
  async create(createWritingDto: CreateWritingDto) {
    const newWritingPost = new this.writingModel(createWritingDto);
    const newWritingPostResult = await newWritingPost.save();
    if (newWritingPostResult) {
      return { statusCode: 200, message: 'SUCCESS', _id: newWritingPost.id };
    }
  }

  async startWriting(start: StartWritingDto, user: any) {
    const pendingWriting = await this.writingModel
      .find({
        owner: user.id,
        status: {
          $nin: [
            WritingStatus.Failed,
            WritingStatus.Finished,
            WritingStatus.Submitted,
            WritingStatus.Processing,
          ],
        },
      })
      .exec();
    if (pendingWriting.length > 0) {
      return {
        statusCode: 200,
        message: 'PENDING_WRITING_POST',
        _id: pendingWriting[0]._id,
        data: pendingWriting[0],
      };
    } else {
      const writingPost = {
        owner: user.id,
        ...start,
      };

      const newWritingPost = new this.writingModel(writingPost);
      const newWritingPostResult = await newWritingPost.save();
      if (newWritingPost) {
        await this.writingModel
          .updateOne(
            { _id: newWritingPost.id },
            {
              status: WritingStatus.Draft,
              $currentDate: { lastModified: true },
              $push: {
                log: {
                  type: 'INFO',
                  message: 'Create success. Change to Draft',
                  code: 'DRAFTED',
                },
              },
            },
          )
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
              this.utilsService.buildToTimer(TaskMinutes[getPost.task]),
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
      const time_lefted = Number(getPost.endTime) - Number(new Date());
      await this.writingModel.updateOne(
        { _id: id, owner: user_id },
        {
          $push: {
            log: {
              type: 'INFO',
              message: 'Restart timer',
              code: 'RESTORE_TIMER',
            },
          },
        },
      );
      return {
        statusCode: 200,
        message: 'WRITING_POST_ALREADY_STARTED',
        data: {
          time_lefted: time_lefted,
          length: this.utilsService.buildToTimerArray(time_lefted),
          content: getPost.content,
        },
      };
    }
  }
  async setProcessingStatus(id: string) {
    const setProcessing = await this.writingModel.updateOne(
      { _id: id },
      {
        status: WritingStatus.Processing,
        $push: {
          log: { type: 'INFO', message: 'Processing', code: 'PROCESSING' },
        },
      },
    );
    return setProcessing.modifiedCount > 0;
  }
  async submittedWriting(id: string, user_id: string, content: string) {
    const getPost = await this.writingModel
      .findOne({ _id: id, owner: user_id })
      .exec();

    if (!getPost) {
      throw new NotFoundException('WRITING_POST_NOT_FOUND');
    }
    if (getPost.status == WritingStatus.Writing) {
      // if (1) {
      if (
        Number(getPost.endTime) +
          Number(this.utilsService.buildToTimer(Penalty)) -
          Number(new Date()) >
        0
      ) {
        const updateContentAndSubmit = await this.writingModel.updateOne(
          {
            _id: id,
            owner: user_id,
          },
          {
            content: content,
            status: WritingStatus.Submitted,
            $currentDate: { lastModified: true, submittedTime: true },
            $push: {
              log: {
                type: 'INFO',
                message: 'Submitted writing',
                code: 'SUBMITTED',
              },
            },
          },
        );
        if (updateContentAndSubmit.modifiedCount == 0) {
          throw new BadGatewayException('CAN_NOT_SUBMIT_WRITING');
        }
        await this.writingQueue.addJob(id);
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

  async buildDataTable(user_id: string) {
    const listAllPost = await this.writingModel
      .find({ owner: user_id })
      .sort({ createdAt: -1 })
      .exec();

    // Convert Date to dd/mm/yyyy string fron element.submittedTime

    const finalDatabase = [];
    let count = 0;
    listAllPost.forEach((element) => {
      // Convert Date to dd/mm/yyyy string fron element.submittedTime
      count += 1;
      const ymd = element.submittedTime.toISOString().split('T')[0];
      const dmy = ymd.split('-').reverse().join('/');
      finalDatabase.push([
        count,
        element.submittedTime.toISOString() == new Date(0).toISOString()
          ? 'Not Submitted'
          : dmy,
        element.mode,
        element.status,
        element.ieltsScore?.overall !== undefined
          ? element.ieltsScore.overall
          : '-1',
        element._id,
      ]);
    });
    return finalDatabase;
  }

  findOne(id: string, user_id: string) {
    return this.writingModel.findOne({ _id: id, owner: user_id }).exec();
  }
}
