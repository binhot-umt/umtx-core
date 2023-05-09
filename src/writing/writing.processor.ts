import { MapiService } from 'src/utils/master-api/mapi.service';
import { WritingService } from './writing.service';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
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
    this.LoggerService.log('Process job: ' + job.data.id);
    const getWriting = await this.writingService.adminGetOneId(job.data.id);

    await this.writingService.setProcessingStatus(job.data.id);

    const ieltsScore = await this.mapi.getScore(getWriting.content);

    const getfeedbackGrammar = await this.mapi.getFeedbackGrammar(
      getWriting.content,
    );
    const getFeedbackStructure = await this.mapi.getFeedbackStructure(
      getWriting.content,
    );

    const structureAnalyst = await this.mapi.getStructureAnalyst(
      getWriting.content,
    );
    const updateResult = await this.writingService.updateResult(
      job.data.id,
      ieltsScore,
      getfeedbackGrammar,
      getFeedbackStructure,
      structureAnalyst,
    );

    if (!updateResult) {
      await this.writingService.setFailed(job.data.id);
      this.LoggerService.log('Job Failed: ' + job.data.id);
    } else {
      this.LoggerService.log('Job done: ' + job.data.id);
    }
  }
}
