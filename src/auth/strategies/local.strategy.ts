import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'eop',
      passwordField: 'password',
    });
  }

  async validate(eop: string, password: string): Promise<any> {
    const user = await this.authService.vaildLogin(eop, password);

    if (!user.data) {
      throw new UnauthorizedException('USER_INFO_NOT_CORRECT');
    }
    return user.data;
  }
}
