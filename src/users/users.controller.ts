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
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  @Patch('/:id')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully patched.',
  })
  @ApiResponse({
    status: 418,
    description: `User with id not found. Will using "I am a teapot" exception as a joke (because we can).`,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Check model arguments.',
  })
  @UsePipes(ValidationPipe)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
  })
  @ApiResponse({
    status: 418,
    description: `User with id not found. Will using "I am a teapot" exception as a joke (because we can).`,
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
