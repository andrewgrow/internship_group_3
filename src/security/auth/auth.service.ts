import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { SignInDto } from './dto/signin.dto';
import { AppJwtService } from '../jwt/app.jwt.service';
import { AppJwtData } from '../jwt/app.jwt.data';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private appJwtService: AppJwtService,
  ) {}

  /**
   * Try to sign in user through validation his password.
   * In success will return encrypted jwt token.
   * @param signInDto SignInDto
   */
  async authUser(signInDto: SignInDto): Promise<any> {
    const error = new BadRequestException('Check email or password');

    const user = await this.userService.getUserByEmail(signInDto.email);
    if (!user) {
      throw error;
    }

    const isPasswordValid = await user.isPasswordValid(signInDto.password);
    if (!isPasswordValid) {
      throw error;
    }

    const data = { id: user['_id'] };
    const jwtToken = this.appJwtService.sign(data as AppJwtData);
    return JSON.stringify({ jwtToken: jwtToken });
  }
}
