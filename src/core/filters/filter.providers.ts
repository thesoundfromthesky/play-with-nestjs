import { mongoExceptionFilterProvider } from "./mongo";
import { mongooseExceptionFilterProvider } from "./mongoose";
import { jwtExceptionFilterProvider } from "./jwt";


export const filterProviders = [
  mongoExceptionFilterProvider,
  mongooseExceptionFilterProvider,
  jwtExceptionFilterProvider
];
