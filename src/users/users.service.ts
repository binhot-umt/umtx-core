import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import validator from 'validator';
import { sha512 } from 'js-sha512';
import { Model } from 'mongoose';
import { UtilsService } from 'src/utils/utils.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserDocument } from './schemas/user.schema';

const PRIVATE_ADDON_PASSWORD = process.env.EXTRA_PASSWORD_STRING;
@Injectable()
export class UsersService {
  /**
   *
   * @param UserModel Mongoose Model de truy van database cua MongoDB
   */
  constructor(
    @InjectModel('Users') private readonly UserModel: Model<UserDocument>,
    private readonly utils: UtilsService,
  ) {}

  /**
   *
   * @param createUserDto : DTO cua tao user moi co class-vaildator de verify input return theo MSG_CODE
   * @returns : Promise<User>
   */
  async isUserExist(userInformation: User): Promise<boolean> {
    const userInformationByPhone = await this.getByEOP(userInformation.phone);

    const userInformationByEmail = await this.getByEOP(userInformation.email);

    return userInformationByEmail !== null || userInformationByPhone !== null;
  }
  async create(newUserBody: CreateUserDto): Promise<User> {
    newUserBody.password = sha512(
      newUserBody.password + PRIVATE_ADDON_PASSWORD,
    );
    if (await this.isUserExist(newUserBody)) {
      throw new BadRequestException('USER_EXIST');
    }
    const newUser = await new this.UserModel(newUserBody);

    return this.utils.returnSafeUser(await newUser.save());
  }

  async findAll() {
    return (await this.UserModel.find({}).exec()).filter((user) =>
      this.utils.returnSafeUser(user),
    );
  }

  async getById(id: string): Promise<User> {
    return this.UserModel.findOne({ _id: id }).exec();
  }

  async update(id: string, newUserInformation: UpdateUserDto) {
    const resultUserUpdate = await this.UserModel.updateOne(
      { _id: id },
      newUserInformation,
    ).exec();
    if (resultUserUpdate.matchedCount == 0) {
      throw new NotFoundException('');
    } else {
      if (resultUserUpdate.modifiedCount == 0) {
        throw new BadRequestException('NOT_THING_CHANGED');
      } else {
        return {
          statusCode: 200,
          message: 'UPDATED',
        };
      }
    }
  }

  async getUserFromId(token: string): Promise<User> {
    return await this.UserModel.findOne({ _id: token }).exec();
  }
  async getUserFromToken(token: string): Promise<User> {
    return await this.UserModel.findOne({ sessionId: token }).exec();
  }
  async getByEOP(emailOrPhone: string): Promise<User> {
    let userInformation: Promise<User>;

    if (validator.isEmail(emailOrPhone)) {
      userInformation = this.UserModel.findOne({ email: emailOrPhone }).exec();
    } else {
      userInformation = this.UserModel.findOne({ phone: emailOrPhone }).exec();
    }
    return userInformation;
  }
  updateUserToken(id: string, newToken: string): boolean | any {
    const updateUserResult = this.UserModel.updateOne(
      { _id: id },
      { sessionId: newToken, lastLogin: new Date().toISOString() },
    ).exec();

    return {
      statusCode: 200,
      data: updateUserResult,
    };
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.UserModel.findOne({ email: email });
    if (!user) throw new NotFoundException('user_not_existed');
    return user;
  }
  async isExistUserByEmail(email: string): Promise<boolean> {
    return (await this.UserModel.find({ email: email }).exec()).length > 0;
  }

  async createUserFromGoogleJWT(profile: any): Promise<User> {
    if (await this.isExistUserByEmail(profile.email)) {
      return await this.findOneByEmail(profile.email);
    } else {
      return await this.UserModel.create({
        name: `${profile.name}`,
        email: profile.email,
        avatar: profile.picture,
      });
    }
  }
}
