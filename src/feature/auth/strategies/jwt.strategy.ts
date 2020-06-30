import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ApiConfigService } from "src/core";
import { JwtPayload } from "src/shared";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy /*, myjwt*/) {
  constructor(private readonly apiConfigService: ApiConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: apiConfigService.jwtSecret
    } as StrategyOptions);
  }

  async validate({ id, emails, roles }: JwtPayload) {
    return { id, emails, roles };
  }
}
