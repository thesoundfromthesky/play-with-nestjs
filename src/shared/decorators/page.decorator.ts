import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Page = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { page: _page, limit: _limit } = request.query;
    let page = Math.max(1, parseInt(_page));
    let limit = Math.max(1, parseInt(_limit));
    page = isNaN(page) ? 1 : page;
    limit = isNaN(limit) ? 10 : limit;

    return { page, limit };
  },
);
