import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { PUBLIC_KEY } from 'src/utils/utils.service';
import { AuthService } from '../auth.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly UserServices: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: PUBLIC_KEY,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    // console.log('payload', payload);
    if (payload.sessionId === undefined) {
      throw new UnauthorizedException('TOKEN_NOT_FOUND');
    }
    const value = await this.cacheManager.get(payload.sessionId);
    if (value == null) {
      const user = await this.UserServices.getUfromToken(payload.sessionId);
      // console.log('user', user, payload.sessionId);
      if (user == null) {
        throw new UnauthorizedException('TOKEN_EXPIRED');
      }
      if (payload.id === user._id) {
        this.cacheManager.set(payload.sessionId, user);
        return {
          id: payload.id,

          phone: payload.phone,
          email: payload.email,
          sessionId: payload.sessionId,
          name: payload.name,
        };
      } else {
        throw new UnauthorizedException('TOKEN_INVAILD');
      }
    }

    return {
      id: payload.id,
      email: payload.email,

      phone: payload.phone,
      sessionId: payload.sessionId,
      name: payload.name,
    };
  }
}
