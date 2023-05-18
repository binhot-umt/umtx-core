import { MapiService } from 'src/utils/master-api/mapi.service';
import { WritingService } from './writing.service';
import { Process, Processor } from '@nestjs/bull';
import * as Bull from 'bull';
import { Logger } from '@nestjs/common';

@Processor('Writing')
export class WritingProcessor {
  private readonly LoggerService = new Logger('WRITING_QUEUE_HANDLE');

  constructor(
    private readonly writingService: WritingService,
    private readonly mapi: MapiService,
  ) {}
  @Process('evalute_handle')
  async readOperationJob(job: Bull.Job<any>) {
    try {
      const systemInfo = await this.mapi.testSystem();
    } catch (e) {
      this.LoggerService.error("Can't connect to system");
      // await this.writingService.setFailed(job.data.id);
      return;
    }
    this.LoggerService.log('Process job: ' + job.data.id);
    const getWriting = await this.writingService.adminGetOneId(job.data.id);

    await this.writingService.setProcessingStatus(job.data.id);

    const ieltsScore = await this.mapi.getScore(
      getWriting.content,
      getWriting.topicContent,
    );

    const getfeedbackGrammar = await this.mapi.getFeedbackGrammar(
      getWriting.content,
      getWriting.topicContent,
    );
    const getFeedbackStructure = await this.mapi.getFeedbackStructure(
      getWriting.content,
      getWriting.topicContent,
    );

    const structureAnalyst = await this.mapi.getStructureAnalyst(
      getWriting.content,
      getWriting.topicContent,
    );
    const rewriteFeedback = await this.mapi.getRewriteFeedback(
      getWriting.content,
      getWriting.topicContent,
    );

    const updateResult = await this.writingService.updateResult(
      job.data.id,
      ieltsScore,
      getfeedbackGrammar,
      getFeedbackStructure,
      structureAnalyst,
      rewriteFeedback,
    );

    if (!updateResult) {
      await this.writingService.setFailed(job.data.id);
      this.LoggerService.log('Job Failed: ' + job.data.id);
    } else {
      this.LoggerService.log('Job done: ' + job.data.id);
    }
  }
}
