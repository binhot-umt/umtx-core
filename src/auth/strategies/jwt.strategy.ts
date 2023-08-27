import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { PUBLIC_KEY } from 'src/utils/utils.service';
import { AuthService } from '../auth.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly UserServices: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: PUBLIC_KEY,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    // console.log('payload', payload);
    const user = await this.UserServices.getUfromToken(
      payload.token,
      payload.pid,
    );
    if (!user) {
      await this.UserServices.resignToken(payload.uid);
      throw new UnauthorizedException('EXPIRED_TOKEN');
    } else {
      return payload;
    }
  }
}
