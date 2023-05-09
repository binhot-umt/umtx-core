import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '../http.service';
import { AxiosRequestConfig } from 'axios';
@Injectable()
export class MapiService {
  private readonly loggerService = new Logger('MAPI_SERVICE');
  private readonly httpService = new HttpService();
  private readonly MAPI_HOST = process.env.MAPI_HOST;
  constructor() {}
  async getScore(content: string): Promise<any> {
    const data = JSON.stringify({
      essay: content,
    });

    return this.httpService.post(this.MAPI_HOST + '/api/v1/score/ielts', data);
  }

  async getFeedbackGrammar(content: string): Promise<any> {
    const data = JSON.stringify({
      essay: content,
    });

    return this.httpService.post(
      this.MAPI_HOST + '/api/v1/feedback/grammar',
      data,
    );
  }

  async getFeedbackStructure(content: string): Promise<any> {
    const data = JSON.stringify({
      essay: content,
    });
    return this.httpService.post(
      this.MAPI_HOST + '/api/v1/feedback/structure',
      data,
    );
  }

  async getStructureAnalyst(content: string): Promise<any> {
    const data = JSON.stringify({
      essay: content,
    });

    return this.httpService.post(this.MAPI_HOST + '/api/v1/structure', data);
  }

  async testSystem(): Promise<boolean> {
    return (await this.httpService.get(this.MAPI_HOST))['Hello'] == 'World';
  }
}
