import {
  ConflictException,
  ImATeapotException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserDocument } from './users.schema';
import { CreateUserDto } from './dto/create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    if (await this.isEmailAlreadyExist(createUserDto.email)) {
      throw new ConflictException('Email already taken');
    }

    const user = new this.userModel(createUserDto);
    await user.validate();

    return user.save();
  }

  private async isEmailAlreadyExist(email: string) {
    const result = await this.userModel.findOne({ email: email });
    return result !== null;
  }

  async updateUser(id, updateUserDto): Promise<User> {
    const userDb = await this.userModel.findById(id);

    if (userDb === null) {
      throw new Error(`User with id ${id} not found for patching!`);
    }
    if (updateUserDto.firstName) {
      userDb.firstName = updateUserDto.firstName;
    }
    if (updateUserDto.lastName) {
      userDb.lastName = updateUserDto.lastName;
    }
    if (updateUserDto.email) {
      userDb.email = updateUserDto.email;
    }
    if (updateUserDto.password) {
      userDb.password = updateUserDto.password;
    }

    return userDb.save();
  }

  async deleteUser(id) {
    const result = await this.userModel.findByIdAndDelete(id);

    if (result === null) {
      throw new NotFoundException('User account not found for deleting!');
    }

    return {
      message: 'Your account has been deleted. Good bye!',
    };
  }

  async getUserById(id): Promise<User> {
    return this.userModel.findById(id);
  }
}
