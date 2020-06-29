import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Id = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.params.id;
  },
);
