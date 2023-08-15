import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from 'src/utils/utils.service';
import { SISAuthGuard } from './guards/sis-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly utils: UtilsService,
  ) {}

  @UseGuards(SISAuthGuard)
  @Post('login')
  async login(@Request() req) {
    // console.log('req.user', req.user);
    return this.authService.login(req.user);
  }

  @Post('sign')
  googleTokenHandle(@Body('token') token: string) {
    return this.authService.jwtLogin(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('info')
  async info(@Request() req) {
    return this.utils.returnSafeUser(
      await this.usersService.getUserFromToken(req.user.sessionId),
    );
  }
}
