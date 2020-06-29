import { APP_INTERCEPTOR } from "@nestjs/core";
import { CacheInterceptor } from "@nestjs/common";

export const cacheInterceptorProvider = {
  provide: APP_INTERCEPTOR,
  useClass: CacheInterceptor
};
