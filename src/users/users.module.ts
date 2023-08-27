import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UtilsService } from 'src/utils/utils.service';
import { MApiModule } from 'src/utils/master-api/mapi.module';
import { JwtModule } from '@nestjs/jwt';
import { PRIVATE_KEY, PUBLIC_KEY } from 'src/utils/utils.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Users', schema: UserSchema, collection: 'users' },
    ]),

    BullModule.registerQueue({
      name: 'SIS',
    }),
    MApiModule,
    JwtModule.register({
      privateKey: PRIVATE_KEY,

      signOptions: { expiresIn: '60d', algorithm: 'RS256' },
    }),
  ],
  controllers: [UsersController],
  providers: [UtilsService, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
