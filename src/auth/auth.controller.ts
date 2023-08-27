import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from 'src/utils/utils.service';

import { encrypt, decrypt } from 'src/utils/encrypt.service';
@UseInterceptors(CacheInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly utils: UtilsService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() login_info: any) {
    // console.log('req.user', req.user);
    return this.authService.login({ ...req.user, ...login_info });
  }

  @UseGuards(JwtAuthGuard)
  @Get('info')
  async info(@Request() req) {
    return this.authService.getMe(req.user.username);
  }
  @Post('design')
  async s(@Body('key') t) {
    // console.log('design-e', t);
    return await decrypt(Buffer.from(t, 'base64'));
  }

  @Post('sign')
  async s3(@Body('key') t) {
    // console.log('Sign-e', t);
    return await encrypt(t);
  }
}
