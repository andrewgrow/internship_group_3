import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create.dto';
import { User } from './users.interface';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update.dto';

@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  get(): User[] {
    return this.usersService.getAll();
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.createUser(createUserDto);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
