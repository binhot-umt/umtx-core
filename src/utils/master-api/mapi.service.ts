import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '../http.service';
import { AxiosRequestConfig } from 'axios';
@Injectable()
export class MapiService {
  private readonly loggerService = new Logger('MAPI_SERVICE');
  private readonly httpService = new HttpService();
  private readonly MAPI_HOST = process.env.MAPI_HOST;
  constructor() {}
  async getScore(content: string, task: string): Promise<any> {
    const data = JSON.stringify({
      essay: content,
      task: task,
    });

    return this.httpService.post(this.MAPI_HOST + '/api/v1/score/ielts', data);
  }

  async getFeedbackGrammar(content: string, task: string): Promise<any> {
    const data = JSON.stringify({
      task: task,
      essay: content,
    });

    return this.httpService.post(
      this.MAPI_HOST + '/api/v1/feedback/grammar',
      data,
    );
  }

  async getFeedbackStructure(content: string, task: string): Promise<any> {
    const data = JSON.stringify({
      essay: content,
      task: task,
    });
    return this.httpService.post(
      this.MAPI_HOST + '/api/v1/feedback/structure',
      data,
    );
  }

  async getStructureAnalyst(content: string, task: string): Promise<any> {
    const data = JSON.stringify({
      essay: content,
      task: task,
    });

    return this.httpService.post(
      this.MAPI_HOST + '/api/v1/effectiveness',
      data,
    );
  }
  async getRewriteFeedback(content: string, task: string): Promise<any> {
    const data = JSON.stringify({
      essay: content,
      task: task,
    });

    return this.httpService.post(this.MAPI_HOST + '/api/v1/rewrite', data);
  }
  async getRewriteCompare(
    oldcontent: string,
    newcontent: string,
    task: string,
  ): Promise<any> {
    const data = JSON.stringify({
      essay: oldcontent,
      modified_essay: newcontent,
      task: task,
    });

    return this.httpService.post(this.MAPI_HOST + '/api/v1/compare', data);
  }
  async testSystem(): Promise<boolean> {
    return (
      (await this.httpService.get(this.MAPI_HOST), {}, { setTimeout: 900 })[
        'Hello'
      ] == 'World'
    );
  }
}
