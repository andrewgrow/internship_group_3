import {
  ConflictException,
  ImATeapotException,
  Injectable,
} from '@nestjs/common';
import { User } from './users.interface';
import { CreateUserDto } from './dto/create.dto';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 0,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'qwerty',
    },
  ];

  getAll(): User[] {
    return this.users;
  }

  createUser(createUserDto: CreateUserDto): User {
    const id = this.users.length;

    if (createUserDto.email && this.isEmailAlreadyExist(createUserDto.email)) {
      throw new ConflictException('Email already taken');
    }

    const user: User = {
      id: id,
      firstName: createUserDto.firstName || `f${id}`,
      lastName: createUserDto.lastName || `l${id}`,
      email: createUserDto.email || `email${id}@example.com`,
      password: createUserDto.password || 'encryptedHash',
    };

    this.users.push(user);

    return user;
  }

  private isEmailAlreadyExist(email: string) {
    let result = false;
    this.users.map((user) => {
      if (email === user.email) {
        result = true;
      }

      return user;
    });
    return result;
  }

  updateUser(id, updateUserDto): User {
    this.checkId(id);

    this.users = this.users.map((user) => {
      if (id === user.id) {
        user.email = updateUserDto.email ?? user.email;
        user.password = updateUserDto.password ?? user.password;
        user.firstName = updateUserDto.firstName ?? user.firstName;
        user.lastName = updateUserDto.lastName ?? user.lastName;
      }

      return user;
    });

    return this.users[id];
  }

  private checkId(id) {
    if (id < 0 || id >= this.users.length) {
      throw new ImATeapotException('Please select correct ID');
    }
  }

  deleteUser(id: number) {
    this.checkId(id);

    let result = 'failure. ID is wrong or user was removed already early.';

    this.users = this.users.map((user) => {
      if (id === user.id) {
        result = 'success';
        user.id = null;
        user.email = null;
        user.password = null;
        user.firstName = null;
        user.lastName = null;
      }

      return user;
    });

    return `Deleting user ${id}: ${result}`;
  }
}
