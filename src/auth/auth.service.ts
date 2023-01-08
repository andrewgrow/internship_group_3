import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authUser(signInDto: SignInDto): Promise<any> {
    const error = new BadRequestException('Check email or password');

    const user = await this.userService.getUserByEmail(signInDto.email);
    if (!user) {
      throw error;
    }

    const isPassportValid = await user.isPasswordValid(signInDto.password);
    if (!isPassportValid) {
      throw error;
    }

    const jwtToken = this.jwtService.sign({ id: user['_id'] });
    return JSON.stringify({ jwtToken: jwtToken });
  }
}
