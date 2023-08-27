import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '../http.service';
import { AxiosRequestConfig } from 'axios';
import { UtilsService } from '../utils.service';
@Injectable()
export class MapiService {
  private readonly loggerService = new Logger('MAPI_SERVICE');
  private readonly httpService = new HttpService();
  private readonly MAPI_HOST = process.env.MAPI_URL;
  private readonly SISAPI_HOST = process.env.SISAPI_URL;
  private readonly utils = new UtilsService();

  async getLogin(username: string, password: string): Promise<any> {
    const data = JSON.stringify({
      username: username,
      password: password,
    });

    return this.httpService.post(this.MAPI_HOST + '/login', data);
  }
  async getMe(token: string, uid: string): Promise<any> {
    const meData = await this.httpService.get_token(
      this.SISAPI_HOST + `/api/v1.0/students/${uid}?select=new_imagefield`,
      token,
    );
    return meData;
  }
  async getYear(token: string): Promise<any> {
    const yearData = await this.httpService.get_token(
      this.SISAPI_HOST +
        `/api/v1.0/select/academicyears?currentdate=${this.utils.today_in_ymd()}`,
      token,
    );
    return yearData;
  }

  async getSem(token: string, uid: string): Promise<any> {
    const semData = await this.httpService.get_token(
      this.SISAPI_HOST + `/api/v1.0/select/terms?academicyearid=${uid}`,
      token,
    );
    return semData;
  }

  async getSchedule(token: string, uid: string, sem: string): Promise<any> {
    const semData = await this.httpService.get_token(
      this.SISAPI_HOST +
        `/api/v1.0/sessions/students/schedule?ses_studentid=${uid}&ses_termid=${sem}`,
      token,
    );
    return semData;
  }

  async getExam(token: string, suid: string, term_id: string): Promise<any> {
    const semData = await this.httpService.get_token(
      this.SISAPI_HOST +
        `/api/v1.0/exams/?ses_studentid=${suid}&ses_termid=${term_id}&select=examinees`,
      token,
    );
    return semData;
  }

  async isLoggon(token: string, puid: string): Promise<boolean> {
    const result_loggon = await this.httpService.post_token(
      this.SISAPI_HOST + `/api/v1.0/auth2/authenticate/${puid}`,
      token,
    );
    return result_loggon.isAuthenticated;
  }

  async testSystem(): Promise<boolean> {
    return (await this.httpService.get(this.MAPI_HOST)) == 'pong';
  }
}
