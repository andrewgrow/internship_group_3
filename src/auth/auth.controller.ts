import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller, HttpCode,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
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
  @UsePipes(ValidationPipe)
  async signIn(@Body() signInDto: SignInDto): Promise<any> {
    return await this.authService.authUser(signInDto);
  }
}
