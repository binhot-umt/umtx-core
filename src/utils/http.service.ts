import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
const ACCEPT_HTTP_CODE = [200, 201];
@Injectable()
export class HttpService {
  private readonly loggerService = new Logger('HTTP_SERVICE');

  async get(url: string, config?: AxiosRequestConfig) {
    const response = await axios.get(url, config);
    this.loggerService.log(
      '[GET] HTTP_SERVICE RETURN  |' + JSON.stringify(response.data) + '|',
    );

    if (!ACCEPT_HTTP_CODE.includes(response.status)) {
      this.loggerService.error('HTTP_SERVICE GET ERROR');
    }
    return response.data;
  }

  async post(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await axios.post(url, data, config);

    this.loggerService.log(
      '[POST] HTTP_SERVICE RETURN |' +
        url +
        '||' +
        JSON.stringify(response.data) +
        '|',
    );
    if (!ACCEPT_HTTP_CODE.includes(response.status)) {
      this.loggerService.error('HTTP_SERVICE POST ERROR');
    }
    return response.data;
  }

  async put(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await axios.put(url, data, config);
    this.loggerService.log(
      '[PUT] HTTP_SERVICE RETURN  |' + JSON.stringify(response.data) + '|',
    );

    if (!ACCEPT_HTTP_CODE.includes(response.status)) {
      this.loggerService.error('HTTP_SERVICE PUT ERROR');
    }
    return response.data;
  }

  async delete(url: string, config?: AxiosRequestConfig) {
    const response = await axios.delete(url, config);
    this.loggerService.log(
      '[DELETE] HTTP_SERVICE RETURN  |' + JSON.stringify(response.data) + '|',
    );

    if (!ACCEPT_HTTP_CODE.includes(response.status)) {
      this.loggerService.error('HTTP_SERVICE DELETE ERROR');
    }
    return response.data;
  }
}
