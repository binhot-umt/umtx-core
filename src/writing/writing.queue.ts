import { Injectable, Logger } from '@nestjs/common';
import * as Bull from 'bull';
import { MapiService } from 'src/utils/master-api/mapi.service';
import { WritingService } from './writing.service';

@Injectable()
export class WritingQueueService {
  private readonly queue: Bull.Queue;
  private readonly LoggerService = new Logger('WRITING_QUEUE');

  constructor(
    private readonly mapi: MapiService,
    private readonly writingService: WritingService,
  ) {
    this.queue = new Bull('writing');
  }

  async addJob(data: any): Promise<void> {
    this.LoggerService.log(`Add job to queue: ${data.id}`);
    await this.queue.add(data);
  }

  async processJob(job: Bull.Job): Promise<void> {
    this.LoggerService.log('Process job: ' + job.data.id);
    const getWriting = await this.writingService.adminGetOneId(job.data.id);
    const ieltsScore = await this.mapi.getScore(getWriting._id);
    const getfeedbackGrammar = await this.mapi.getFeedbackGrammar(
      getWriting._id,
    );
    const getFeedbackStructure = await this.mapi.getFeedbackStructure(
      getWriting._id,
    );

    const structureAnalyst = await this.mapi.getStructureAnalyst(
      getWriting._id,
    );
    const updateResult = this.writingService.updateResult(
      job.data.id,
      ieltsScore,
      getfeedbackGrammar,
      getFeedbackStructure,
      structureAnalyst,
    );

    if (!updateResult) {
      await this.writingService.setFailed(job.data.id);
    }
  }

  async start(): Promise<void> {
    this.LoggerService.log('Start queue');

    this.queue.process(this.processJob.bind(this));
  }
}
