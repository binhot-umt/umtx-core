import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import * as Bull from 'bull';
import { type } from 'os';

@Injectable()
export class UsersQueueService {
  // private readonly queue: Bull.Queue;
  private readonly LoggerService = new Logger('SIS_QUEUE_LOGIN');

  constructor(@InjectQueue('SIS') private readonly queue: Bull.Queue) {}

  async addJobLogin(data: any): Promise<void> {
    this.LoggerService.log(`Add job_login to queue: ${data}`);
    await this.queue.add('sis_login', {
      id: data,
    });
  }
  async addJobSync(data: any): Promise<void> {
    this.LoggerService.log(`Add job_sync to queue: ${data}`);
    await this.queue.add('sis_sync', {
      id: data,
    });
  }
  async removeAllJob() {
    await this.queue.empty();
  }
  async getAllJobId() {
    const jobs = await this.queue.getJobs([
      'delayed',
      'active',
      'waiting',
      'completed',
    ]);

    // console.log(`Total jobs in queue: ${jobs.length}`);
    const total = [];
    jobs.forEach((job: Bull.Job) => {
      total.push(job.data.id);
    });
    return total;
  }
}
