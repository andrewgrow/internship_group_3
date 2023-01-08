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
  HttpCode,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create.dto';
import { User } from './users.schema';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update.dto';
import { ApiBody, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The records have been successfully found.',
  })
  async get(): Promise<User[]> {
    return await this.usersService.getAll();
  }

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Check model arguments.',
  })
  @ApiResponse({
    status: 409,
    description: 'Email is already taken. Set other email or log in.',
  })
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(createUserDto);
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully found.',
  })
  @ApiResponse({
    status: 404,
    description: `User with id not found.`,
  })
  @UsePipes(ValidationPipe)
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch('/:id')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully patched.',
  })
  @ApiResponse({
    status: 404,
    description: `User with id not found.`,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Check model arguments.',
  })
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: `User account not found for deleting.`,
  })
  delete(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
