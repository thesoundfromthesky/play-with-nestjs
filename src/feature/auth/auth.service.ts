import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
// import * as bcrypt from 'bcryptjs';
import { JwtPayload } from 'src/shared';
import {
  CreateUserDto,
  Save,
  ToObject,
  OrFail,
  Lean,
  Auth,
  QueryOptions,
  UserToEntity,
  Populate,
  User,
  UserDocumentQuery,
  AuthDocumentQuery,
  AuthQuery,
  AuthDocument,
} from 'src/mongoose';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PagePayload, TokenPayload } from 'src/shared';
import { TokenService, RedisService } from './services';
import { ApiConfigService } from 'src/core';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    // private readonly redisService: RedisService,
    @InjectModel(Auth.name)
    private readonly authModel: Model<AuthDocument, AuthQuery>,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  @ToObject()
  @Save()
  create(
    auth: Partial<Auth>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: QueryOptions,
  ): AuthDocument {
    return new this.authModel(auth);
  }

  async findAll(
    pagePayload: PagePayload = { page: 1, limit: 10 },
  ): Promise<{
    auths;
    maxPage: number;
    currentPage: number;
    limit: number;
  }> {
    const { page, limit } = pagePayload;

    const skip = (page - 1) * limit;
    const count = await this.authModel.countDocuments({});
    const maxPage = Math.ceil(count / limit);
    const auths = await this.authModel
      .find({})
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true, getters: true, defaults: true })
      .orFail();

    return { auths, maxPage, currentPage: page, limit };
  }

  @OrFail()
  @Lean()
  @Populate()
  findOne(
    query: AuthDocumentQuery,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: QueryOptions,
  ): AuthDocumentQuery {
    return query;
  }

  byUserId(userId: string): AuthDocumentQuery {
    return this.authModel.findOne().byUserId(userId);
  }

  findByUserId(userId: string, options?: QueryOptions): AuthDocumentQuery {
    return this.findOne(this.byUserId(userId), options);
  }

  // @ToObject()
  // @Save()
  // update(
  //   { userId, body }: { userId: string; body: Record<string, unknown> },
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   options?: QueryOptions,
  // ): AuthDocumentQuery {
  //   return this.findByUserId(userId, { lean: false });
  // }

  @ToObject()
  @Save()
  async delete(
    userId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: QueryOptions,
  ): Promise<AuthDocument> {
    const auth = await this.findByUserId(userId, { lean: false });

    auth.isDeleted = true;

    return auth;
  }

  async login({
    id,
    emails,
    roles,
  }: JwtPayload): Promise<{ token: Partial<TokenPayload> }> {
    const payload = { id, emails, roles };
    const access_token = this.tokenService.generateAccessToken(payload);
    const refresh_token = this.tokenService.generateRefreshToken(payload);

    const auth = await this.findByUserId(id, { lean: false, orFail: false });

    // client.set("key", "value", redis.print);
    // client.get("key", redis.print);
    if (auth) {
      auth.refreshToken = refresh_token;
      await auth.save();
    } else {
      await this.create({ user: id, refreshToken: refresh_token } as any);
    }

    return {
      token: {
        access_token,
        refresh_token,
      },
    };
  }

  async logout({
    id,
    emails,
    roles,
  }: JwtPayload): Promise<{ message: string } | string> {
    const auth = await this.findByUserId(id, {
      lean: false,
    });
    if (auth.refreshToken) {
      auth.refreshToken = undefined;
      await auth.save();
      return { message: `${id} logout success` };
    } else {
      return `logout fail`;
    }
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ token: Partial<TokenPayload> }> {
    const user = await this.userService.create(createUserDto);
    const token = await this.login(user);
    return token;
  }

  getProfile(user: JwtPayload): UserDocumentQuery {
    return this.userService.findById(user.id);
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ token: Partial<TokenPayload> }> {
    const token: JwtPayload = this.tokenService.verifyToken(refreshToken);
    const { id, emails, roles } = token;
    const auth = await this.findByUserId(id, {
      lean: false,
      populate: { path: User.name.toLowerCase(), select: 'id emails roles' },
    });

    if (auth.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Unauthorized Refresh token');
    }

    const { user } = auth;
    const payload = {
      id: user.id,
      emails: user.emails,
      roles: user.roles,
    };
    const access_token = this.tokenService.generateAccessToken(payload);
    let refresh_token = refreshToken;

    if (
      emails[0].value !== user.emails[0].value ||
      this.tokenService.canRefresh(token)
    ) {
      refresh_token = this.tokenService.generateRefreshToken(payload);
      auth.refreshToken = refresh_token;
      await auth.save();
    }

    return {
      token: { access_token, refresh_token },
    };
  }

  async googleCallback(user: JwtPayload): Promise<string> {
    const payload = await this.login(user);
    const token = encodeURIComponent(JSON.stringify(payload));
    return `${this.apiConfigService.redirect}/auth/callback?token=${token}`;
  }

  @UserToEntity()
  @ToObject()
  @Save()
  async deleteSocial(
    jwtPayload: JwtPayload,
    socialMedia: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: QueryOptions,
  ): Promise<User> {
    const { id } = jwtPayload;
    const user = await this.userService.findById(id, {
      lean: false,
      entity: false,
    });

    if (user.login) {
      user.socialMediaHandles.delete(socialMedia);
    }
    return user;
  }
}
