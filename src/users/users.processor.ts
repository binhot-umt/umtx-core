import { MapiService } from 'src/utils/master-api/mapi.service';
import { Process, Processor } from '@nestjs/bull';
import * as Bull from 'bull';
import { Logger } from '@nestjs/common';
import { UsersService } from './users.service';

@Processor('SIS')
export class WritingProcessor {
  private readonly LoggerService = new Logger('USERS_PROCESSOR');

  constructor(
    private readonly users: UsersService,
    private readonly mapi: MapiService,
  ) {}
  @Process('sis_login')
  async readOperationJob(job: Bull.Job<any>) {
    try {
      const systemInfo = await this.mapi.testSystem();
    } catch (e) {
      this.LoggerService.error("Can't connect to system");
      return;
    }
    const loginDetails = await this.users.getById(job.data.id);
    this.LoggerService.log('Process job: ' + job.data.id);
  }
}
