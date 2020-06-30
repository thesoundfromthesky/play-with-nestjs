import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {
  Strategy,
  StrategyOptionsWithRequest,
  AuthenticateOptionsGoogle
} from "passport-google-oauth20";
import { ApiConfigService } from "src/core";
import { AuthStrategy } from "src/shared";
import { AuthService } from "../auth.service";
import { TokenService } from "../services";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, AuthStrategy.Google) {
  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService
  ) {
    super({
      clientID: apiConfigService.googleClientId,
      clientSecret: apiConfigService.googleClientSecret,
      callbackURL: `${apiConfigService.baseUrl}/api/auth/google/callback`,
      passReqToCallback: true,
      scope: ["profile", "email"]
    } as StrategyOptionsWithRequest);
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile
  ) {
    const token = request.query.state;
    let email;
    if (token) {
      const payload = this.tokenService.verifyToken(token);
      email = payload.emails[0].value;
    } else {
      email = profile.emails[0].value;
    }
    const user = await this.authService.updateUser(profile, email);
    return user;
  }

  authenticate(req, options: AuthenticateOptionsGoogle): any {
    super.authenticate(
      req,
      Object.assign(options, {
        accessType: "offline",
        // prompt: "consent"
        state: req.query.state
      } as AuthenticateOptionsGoogle)
    );
  }
}
