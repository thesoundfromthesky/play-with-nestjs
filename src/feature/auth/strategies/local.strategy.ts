import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/feature/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  // constructor(private readonly authService: AuthService) {
  constructor(private readonly userService: UserService) {
    super();
    // super({
    //     usernameField: 'email',
    //     passwordField: 'password',
    //   } as IStrategyOptionsWithRequest);
  }

  // async validate(username: string, password: string): Promise<any> {
  //   const user = await this.authService.validateUser(username, password);
  //   if (!user) {
  //     throw new UnauthorizedException('Login failed');
  //   }
  //   return user;
  // }
  async validate(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username, {
      lean: false,
      entity: false,
    });
  
    if (user.login.authenticate(password)) {
      delete user.login.password;
      return user;
    }

    throw new UnauthorizedException('Login failed');
  }
}
