import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    const userInCache = await this.authService.checkInCache(username, password);
    const user = userInCache;
    console.log('user', user);
    if (userInCache.error) {
      const cuser = await this.authService.sis_crawl_sign(username, password);
      if (cuser.error) {
        throw new UnauthorizedException(user.message);
      }
      return {
        token: cuser.token,
        suid: cuser.suid,
        puid: cuser.puid,
      };
    }
    return {
      token: user.data.sis_token,
      suid: user.data.suid,
      puid: user.data.puid,
    };
  }
}
