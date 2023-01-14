import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Use this decorator in controllers to getting user's id from jwt token.
 * @example:
 * @Get('/somePath')
 * someMethod(@UserId() userId: string) {
 *   console.log(userId);
 * }
 */
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user_id; // it was added into appJwtService.verifyRequestHeaders
  },
);
