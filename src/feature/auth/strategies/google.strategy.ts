import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  StrategyOptionsWithRequest,
  AuthenticateOptionsGoogle,
} from 'passport-google-oauth20';
import { ApiConfigService } from 'src/core';
import { AuthStrategy } from 'src/shared';
import { TokenService } from '../services';
import { User, UserDocument } from 'src/mongoose';
import { Request } from 'express';
import { UserService } from 'src/feature/user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  AuthStrategy.Google,
) {
  constructor(
    private readonly apiConfigService: ApiConfigService,

    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: apiConfigService.googleClientId,
      clientSecret: apiConfigService.googleClientSecret,
      callbackURL: `${apiConfigService.baseUrl}/api/auth/google/callback`,
      passReqToCallback: true,
      scope: ['profile', 'email'],
    } as StrategyOptionsWithRequest);
  }

  async validate(
    request: Request,
    accessToken: string,
    refreshToken: string,
    profile: User,
  ): Promise<User> {
    const token = request.query.state;
    let email;
    if (token) {
      const payload = this.tokenService.verifyToken(token as any);
      email = payload.emails[0].value;
    } else {
      email = profile.emails[0].value;
    }
    const user = await this.updateUser(profile, email);
    return user;
  }

  authenticate(req: Request, options: AuthenticateOptionsGoogle): void {
    super.authenticate(
      req,
      Object.assign(options, {
        accessType: 'offline',
        // prompt: "consent"
        state: req.query.state,
      } as AuthenticateOptionsGoogle),
    );
  }

  async updateUser(profile: User, email: string): Promise<UserDocument> {
    const user = await this.userService.findByEmailValue(email, {
      lean: false,
      entity: false,
      orFail: false,
    });
    const { name, emails } = profile;

    if (!user) {
      const newUser: any = {
        name,
        emails,
        socialMediaHandles: { google: emails[0].value },
      };

      return await this.userService.create(newUser);
    } else {
      if (user.socialMediaHandles.get('google')) {
        return user;
      } else {
        user.socialMediaHandles.set('google', emails[0].value);
        const savedUser = await user.save();
        return savedUser.toObject();
      }
    }
  }
}
