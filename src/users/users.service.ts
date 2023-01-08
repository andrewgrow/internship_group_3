import {
  ConflictException,
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
    return await this.userModel.find().exec();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    if (await this.isEmailAlreadyExist(createUserDto.email)) {
      throw new ConflictException('Email already taken');
    }

    const user = new this.userModel(createUserDto);
    await user.validate();
    const result = await user.save();

    return result;
  }

  private async isEmailAlreadyExist(email: string) {
    const result = await this.userModel.findOne({ email: email });
    return result !== null;
  }

  async updateUser(id, updateUserDto): Promise<User> {
    const userDb = await this.userModel.findById(id);

    if (userDb === null) {
      throw new NotFoundException(`User with id ${id} not found for patching.`);
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

    const result = await userDb.save();

    return result;
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
    const result = await this.userModel.findById(id);
    if (result === null) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
    return result;
  }

  async getUserByEmail(email): Promise<User> {
    const result = await this.userModel.findOne({ email: email }).exec();
    return result;
  }
}
