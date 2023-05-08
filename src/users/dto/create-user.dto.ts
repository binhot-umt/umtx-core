import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsPhoneNumber,
  IsUUID,
} from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto extends User {
  @IsNotEmpty({ message: 'NAME_SHOULD_NOT_EMPTY' })
  name: string;
  @IsEmail({ message: 'Email _!IsEmail' })
  @IsNotEmpty({ message: 'Email _!IsNotEmpty' })
  email: string;

  @IsNotEmpty({ message: 'Số điện _!IsNotEmpty' })
  @IsPhoneNumber('VN', { message: 'Phone  _!IsPhoneNumber' })
  phone: string;

  @IsNotEmpty({ message: 'Mật khẩu _!IsNotEmpty' })
  password: string;
}
