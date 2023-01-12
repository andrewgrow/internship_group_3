import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Header,
  HttpCode,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create.dto';
import { User } from '../../users/users.schema';
import { CreateUserValidationPipe } from './pipes/validation.pipe';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign_in')
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'Successful authorization.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request. Check model arguments or email and password do not match.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found. Try create account.',
  })
  @HttpCode(200)
  @Header('content-type', 'application/json')
  async signIn(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    signInDto: SignInDto,
  ): Promise<any> {
    return this.authService.authUser(signInDto);
  }

  @Post('/sign_up')
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
  async create(
    @Body(new CreateUserValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.authService.createUser(createUserDto);
  }
}
