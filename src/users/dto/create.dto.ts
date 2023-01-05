import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { User } from '../users.interface';

export class CreateUserDto implements Partial<User> {
  @IsNotEmpty()
  @Length(5, 100)
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Length(2, 20)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 20)
  lastName?: string;

  @IsString()
  @Length(8, 1024)
  password: string;
}
