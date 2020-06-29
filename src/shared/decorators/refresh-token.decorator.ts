import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from '../interfaces';

export const RefreshToken = createParamDecorator(
  (data: string, ctx: ExecutionContext): TokenPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.body.token.refresh_token;
  },
);
