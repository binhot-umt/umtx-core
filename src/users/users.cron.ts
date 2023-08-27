import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MapiService } from 'src/utils/master-api/mapi.service';
import { UsersService } from './users.service';
import { UsersQueueService } from './users.queue';

@Injectable()
export class UsersCronService {
  private readonly logger = new Logger(UsersCronService.name);
  constructor(
    private readonly users: UsersService,
    private sis_queue: UsersQueueService,
    private mapi: MapiService,
    @InjectQueue('SIS') private readonly myQueue: Queue,
  ) {}
  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    const currentJobId = this.sis_queue.getAllJobId();

    const listAllPost = await this.users.findAllProcessing();
    this.logger.debug(
      `Cronjob running RUNNING:${(await currentJobId).length} | PENDING:${
        (await listAllPost).length
      } `,
    );

    listAllPost.forEach(async (element) => {
      const listCurrrentJob = await currentJobId;
      if (!listCurrrentJob.includes(element._id)) {
        this.logger.debug('APPEND JOB: ' + element._id);

        this.sis_queue.addJobLogin(element._id);
      }
    });
  }

  //   @Cron(CronExpression.EVERY_SECOND)
  async truncateJob() {
    this.logger.warn('Remove all jobs');
    await this.sis_queue.removeAllJob();
  }
  @Cron(CronExpression.EVERY_MINUTE)
  async checkSystemUp() {
    try {
      const systemInfo = await this.mapi.testSystem();
    } catch (e) {
      this.logger.error('System is down');
    }
  }
}
