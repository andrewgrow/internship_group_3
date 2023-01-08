import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppJwtService } from './app.jwt.service';

/**
 * This Guard protect requests that must contains encrypted JWT token.
 */
@Injectable()
export class AppJwtGuard implements CanActivate {
  constructor(private appJwtService: AppJwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  /**
   * Will return true (request can be processed) or throw Forbidden exception.
   * @param request the Express Request object
   */
  validateRequest(request) {
    try {
      // two "!!" are the same as "if (foo) return true";
      return !!this.appJwtService.verifyRequestHeaders(request);
    } catch (error) {
      throw new HttpException(error, HttpStatus.FORBIDDEN);
    }
  }
}
