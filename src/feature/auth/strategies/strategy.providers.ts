import { LocalStrategy } from "./local.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { GoogleStrategy } from "./google.strategy";

export const strategyProviders = [LocalStrategy, JwtStrategy, GoogleStrategy];
