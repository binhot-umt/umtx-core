import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { sha512 } from 'js-sha512';

import { UsersService } from 'src/users/users.service';
import { UtilsService } from 'src/utils/utils.service';
import { encrypt, decrypt } from 'src/utils/encrypt.service';

import { OAuth2Client } from 'google-auth-library';
import { JwtPayload } from 'src/utils/interface';
import { MapiService } from 'src/utils/master-api/mapi.service';
/**
 * EXTRA_PASSWORD_STRING la gia tri bien khien mat khau co them extra string cho du lo database
 * cung khong the decrypt ra origin password
 */
export const PRIVATE_ADDON_PASSWORD = process.env.EXTRA_PASSWORD_STRING;
export const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly UserService: UsersService,
    private readonly utils: UtilsService,
    private readonly mapi: MapiService,
  ) {}
  async sis_crawl_sign(email: string, password: string) {
    const login_result = await this.mapi.getLogin(email, password);
    return login_result;
  }
  resignToken = async (id) => {
    // await this.UserService.resignSIS(id);
  };
  async checkInCache(email: string, password: string) {
    const findUser = await this.UserService.findOneByEmail(email);

    if (findUser) {
      const decrypted_password = await (
        await decrypt(Buffer.from(findUser.password, 'base64'))
      ).toString();

      if (decrypted_password === password + '_UMTX') {
        return { error: false, data: findUser, message: 'SUCCESS' };
      } else {
        return { error: true, data: null, message: 'PASSWORD_NOT_CORRECT' };
      }
    } else {
      return { error: true, data: null, message: 'USER_NOT_FOUND' };
    }
  }
  async vaildLogin(eop: string, password: string) {
    let user = await this.UserService.getByEOP(eop);
    let message;
    if (user && user.password === sha512(password + PRIVATE_ADDON_PASSWORD)) {
      /**
       * Tao token moi sau do cap nhat token vao database (UPDATE $ WHERE `_id`='user.id')
       * Dong thoi viec update nay se revoke cac token cu => cac token cu se bi logOut
       */
      const newToken = this.utils.randomToken();
      await this.UserService.updateUserToken(user._id, newToken);

      /**
        Fetch du lieu moi tu database xong khi da update Token
      */
      user = await this.UserService.getById(user._id);

      const { ...result } = user;

      result['_doc'].sessionId = newToken;

      return { data: result['_doc'], message: 'SUCCESS' };
    } else {
      // console.error('Tài khoản mật khẩu không chính xác');
      message = 'USER_PASSWORD_NOT_CORRECT';
    }

    return { data: null, message: message };
  }
  async getUfromToken(token: string, puid: string) {
    if (await this.mapi.isLoggon(token, puid)) {
      return true;
    } else {
      return false;
    }
  }
  async login(user: any) {
    const payload_user = user;
    const payload = {
      token: payload_user.token,
      uid: payload_user.suid,
      pid: payload_user.puid,

      username: payload_user.username,
      password: await encrypt(payload_user.password + '_UMTX'),
      id: payload_user.puid,
    };
    try {
      const user = await this.UserService.createUserFromSIS(payload);
      // console.log('user', user);
      payload.id = user._id;
    } catch (error) {
      console.log('e', error);
      console.log('Fail to import');
    }

    return {
      statusCode: 200,
      message: 'LOGIN_SUCCESS',
      data: {
        access_token: this.jwtService.sign(payload),
      },
    };
  }
  async getMe(email: string) {
    const user = await this.UserService.getByEOP(email);
    // console.log('user', user);
    return {
      statusCode: 200,
      message: 'GET_ME_SUCCESS',
      data: user,
    };
  }
  // async createUser(newUser: any) {
  //   if (await this.UserService.getByEOP(newUser.eop)) {
  //     return {
  //       statusCode: 400,
  //       message: 'USER_EXISTED',
  //       data: null,
  //     };
  //   }
  // }
}
