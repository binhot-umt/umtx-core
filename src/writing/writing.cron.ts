import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WritingService } from './writing.service';
import { WritingStatus } from './entities/writing.status.enum';
import { WritingQueueService } from './writing.queue';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class WritingCronService {
  private readonly logger = new Logger(WritingCronService.name);
  constructor(
    private readonly writingService: WritingService,
    private writingQueue: WritingQueueService,
    @InjectQueue('Writing') private readonly myQueue: Queue,
  ) {}
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const currentJobId = this.writingQueue.getAllJobId();

    const listAllPost = await this.writingService.findAllProcessing();
    this.logger.debug(
      `Cronjob running RUNNING:${(await currentJobId).length} | PENDING:${
        (await listAllPost).length
      } `,
    );

    listAllPost.forEach(async (element) => {
      const listCurrrentJob = await currentJobId;
      //   console.log('listCurrrentJob', listCurrrentJob);
      if (!listCurrrentJob.includes(element._id)) {
        this.logger.debug('APPEND JOB: ' + element._id);

        this.writingQueue.addJob(element._id);
      }
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleFailed() {
    const count = (await this.writingService.findAllTimeOut()).matchedCount;
    if (count > 0) {
      this.logger.log('Change status FAILED job edited count: ' + count);
    }
  }

  //   @Cron(CronExpression.EVERY_SECOND)
  async truncateJob() {
    this.logger.warn('Remove all jobs');
    await this.writingQueue.removeAllJob();
    // find all empty queue\
  }
}
