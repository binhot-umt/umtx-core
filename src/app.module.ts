import { CacheModule, Module } from '@nestjs/common';

import * as path from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { UtilsService } from './utils/utils.service';
import { WritingModule } from './writing/writing.module';
import { BullModule } from '@nestjs/bull';
import { TopicsModule } from './topics/topics.module';
import { MApiModule } from './utils/master-api/mapi.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    CacheModule.register(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    MApiModule,
    UsersModule,
    AuthModule,
    WritingModule,
    TopicsModule,
  ],

  controllers: [AppController],
  providers: [AppService, UtilsService],
})
export class AppModule {}
