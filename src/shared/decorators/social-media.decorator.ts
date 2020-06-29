import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SocialMedia = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.params.social_media;
  },
);
