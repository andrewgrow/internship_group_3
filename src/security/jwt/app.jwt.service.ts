import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppJwtData } from './app.jwt.data';

@Injectable()
export class AppJwtService {
  constructor(private jwtService: JwtService) {}

  /**
   * Encode incoming data to JWT token.
   * @param data enough something e.g. { id: 'userDatabaseId' }
   */
  sign(data: AppJwtData) {
    return this.jwtService.sign(data);
  }

  /**
   * Check if JWT token is valid.
   * @param token String
   */
  verifyToken(token: string): AppJwtData {
    return this.jwtService.verify(token);
  }

  /**
   * Check if a request contains right auth header and valid token from it.
   * @param request the Express Request object.
   * @return AppJwtData or throw exception
   */
  verifyRequestHeaders(request): AppJwtData {
    if (!request || !request.headers || !request.headers.authorization) {
      throw new Error(
        'VerifyRequestHeaders fail. You forgot add Auth Bearer token?',
      );
    }
    const token = (request.headers.authorization || '').replace(/^Bearer /, '');
    return this.verifyToken(token);
  }
}
