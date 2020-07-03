import {
  Controller,
  Get,
  Post,
  UseGuards,
  Delete,
  Body,
  Redirect,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, User as IUser, UserDocument, UserDocumentQuery } from 'src/mongoose';
import {
  AuthStrategy,
  User,
  JwtPayload,
  RefreshToken,
  SocialMedia,
  TokenPayload,
} from 'src/shared';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ token: Partial<TokenPayload> }> {
    return this.authService.register(createUserDto);
  }

  // @UseGuards(RolesGuard)
  @UseGuards(AuthGuard(AuthStrategy.Local))
  // @Roles(Role.Admin)
  @Post('login')
  login(@User() user: JwtPayload): Promise<{ token: Partial<TokenPayload> }> {
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard(AuthStrategy.Jwt))
  @Delete('logout')
  logout(@User() user: JwtPayload): Promise<{ message: string } | string> {
    return this.authService.logout(user);
  }

  @UseGuards(AuthGuard(AuthStrategy.Jwt))
  @Get('profile')
  getProfile(@User() user: JwtPayload): UserDocumentQuery {
    return this.authService.getProfile(user);
  }

  @Post('refresh_token')
  refreshToken(
    @RefreshToken() refreshToken: string,
  ): Promise<{ token: Partial<TokenPayload> }> {
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(AuthGuard(AuthStrategy.Google))
  @Get('google')
  google(): void {
    // initiates the Google OAuth2 login flow
  }

  @UseGuards(AuthGuard(AuthStrategy.Google))
  @Redirect()
  @Get('google/callback')
  async googleCallback(
    @User() user: JwtPayload,
  ): Promise<{ url: string; statusCode: number }> {
    // handles the Google OAuth2 callback
    const url = await this.authService.googleCallback(user);
    return { url, statusCode: 301 };
  }

  @UseGuards(AuthGuard(AuthStrategy.Jwt))
  @Delete('social/:social_media')
  deleteSocial(
    @User() user: JwtPayload,
    @SocialMedia() socialMedia: string,
  ): Promise<IUser> {
    return this.authService.deleteSocial(user, socialMedia);
  }
}
