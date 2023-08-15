import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '../http.service';
import { AxiosRequestConfig } from 'axios';
@Injectable()
export class MapiService {
  private readonly loggerService = new Logger('MAPI_SERVICE');
  private readonly httpService = new HttpService();
  private readonly MAPI_HOST = process.env.MAPI_HOST;
  constructor() {}
  async getLogin(content: string, task: string): Promise<any> {
    const data = JSON.stringify({
      essay: content,
      task: task,
    });

    return this.httpService.post(this.MAPI_HOST + '/login', data);
  }

  async testSystem(): Promise<boolean> {
    return (await this.httpService.get(this.MAPI_HOST)) == 'pong';
  }
}
