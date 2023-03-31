import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UtilsService } from 'src/utils/utils.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Users', schema: UserSchema, collection: 'users' },
    ]),
  ],
  controllers: [UsersController],
  providers: [UtilsService, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
