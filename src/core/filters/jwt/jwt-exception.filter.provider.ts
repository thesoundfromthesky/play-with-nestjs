import { APP_FILTER } from "@nestjs/core";
import { JwtExceptionFilter } from "./jwt-exception.filter";

export const jwtExceptionFilterProvider = {
  provide: APP_FILTER,
  useClass: JwtExceptionFilter
};
