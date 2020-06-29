import { APP_FILTER } from "@nestjs/core";
import { MongooseExceptionFilter } from "./mongoose-exception.filter";

export const mongooseExceptionFilterProvider = {
  provide: APP_FILTER,
  useClass: MongooseExceptionFilter
};
