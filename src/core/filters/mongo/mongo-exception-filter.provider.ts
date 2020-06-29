import { APP_FILTER } from "@nestjs/core";
import { MongoExceptionFilter } from "./mongo-exception.filter";

export const mongoExceptionFilterProvider = {
  provide: APP_FILTER,
  useClass: MongoExceptionFilter
};
