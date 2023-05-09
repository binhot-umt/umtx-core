import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import * as Bull from 'bull';

@Injectable()
export class WritingQueueService {
  // private readonly queue: Bull.Queue;
  private readonly LoggerService = new Logger('WRITING_QUEUE');

  constructor(@InjectQueue('Writing') private readonly queue: Bull.Queue) {}

  async addJob(data: any): Promise<void> {
    this.LoggerService.log(`Add job to queue: ${data}`);
    await this.queue.add('evalute_handle', {
      id: data,
    });
  }
}
