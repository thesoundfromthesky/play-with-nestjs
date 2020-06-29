import { APP_INTERCEPTOR } from "@nestjs/core";
import { ClassSerializerInterceptor } from "@nestjs/common";

export const classSerializerInterceptorProvider = {
  provide: APP_INTERCEPTOR,
  useClass: ClassSerializerInterceptor
};
