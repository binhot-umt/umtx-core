import { CacheModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { PRIVATE_KEY, PUBLIC_KEY, UtilsService } from 'src/utils/utils.service';
import { UsersModule } from 'src/users/users.module';
import { APP_GUARD } from '@nestjs/core';
@Module({
  imports: [
    PassportModule,
    CacheModule.register(),
    JwtModule.register({
      privateKey: PRIVATE_KEY,

      signOptions: { expiresIn: '60d', algorithm: 'RS256' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [UtilsService, AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
