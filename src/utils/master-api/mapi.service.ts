import { BadRequestException, Injectable, LoggerService } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
const MAPI_HOST = process.env.MAPI_HOST;
@Injectable()
export class MapiService {
  // private readonly logger: LoggerService;
  // constructor() {}
  async getScore(content: string): Promise<any> {
    const data = JSON.stringify({
      essay: content,
    });

    const config: AxiosRequestConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: MAPI_HOST + '/api/v1/score/ielts',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new BadRequestException('CAN_NOT_GET_SCORE');
      });
  }

  async getFeedbackGrammar(content: string): Promise<any> {
    const data = JSON.stringify({
      essay: content,
    });

    const config: AxiosRequestConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: MAPI_HOST + '/api/v1/feedback/grammar',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new BadRequestException('CAN_NOT_GET_FEEDBACK_GRAMMAR');
      });
  }

  async getFeedbackStructure(content: string): Promise<any> {
    const data = JSON.stringify({
      essay: content,
    });

    const config: AxiosRequestConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: MAPI_HOST + '/api/v1/feedback/structure',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new BadRequestException('CAN_NOT_GET_FEEDBACK_STRUCTURE');
      });
  }

  async getStructureAnalyst(content: string): Promise<any> {
    const data = JSON.stringify({
      essay: content,
    });

    const config: AxiosRequestConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: MAPI_HOST + '/api/v1/structure',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new BadRequestException('CAN_NOT_GET_STRUCTURE_ANALYST');
      });
  }
}
