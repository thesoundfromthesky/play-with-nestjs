import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  QueryOptions,
  UserQuery,
  UserDocument,
  UserDocumentQuery,
} from 'src/mongoose';
import { CreateUserDto } from 'src/mongoose';
import { PagePayload } from 'src/shared';
import { merge } from 'lodash/fp/object';
import {
  ToObject,
  UserToEntity,
  UsersToEntity,
  Save,
  Lean,
  Select,
  OrFail,
} from 'src/mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument, UserQuery>,
  ) {}

  @UserToEntity()
  @ToObject()
  @Save()
  async create(
    createUserDto: CreateUserDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: QueryOptions,
  ): Promise<UserDocument> {
    return new this.userModel(createUserDto);
  }

  @UsersToEntity()
  async findAll(
    pagePayload: PagePayload,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: QueryOptions,
  ): Promise<{
    users;
    maxPage: number;
    currentPage: number;
    limit: number;
  }> {
    const { page, limit } = pagePayload;

    const skip = (page - 1) * limit;
    const count = await this.userModel.countDocuments({});
    const maxPage = Math.ceil(count / limit);

    const users = await this.userModel
      .find({ isDeleted: false })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true, getters: true, defaults: true })
      .orFail();

    return { users, maxPage, currentPage: page, limit };
  }

  @UserToEntity()
  @OrFail()
  @Lean()
  @Select()
  findOne(
    query: UserDocumentQuery,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: QueryOptions,
  ): UserDocumentQuery {
    return query;
  }

  byId(id: string): UserDocumentQuery {
    return this.userModel.findOne().byId(id);
  }

  byLoginUsername(username: string): UserDocumentQuery {
    return this.userModel.findOne().byLoginUsername(username);
  }

  byEmailValue(email: string): UserDocumentQuery {
    return this.userModel.findOne().byEmailValue(email);
  }

  findById(id: string, options?: QueryOptions): UserDocumentQuery {
    return this.findOne(this.byId(id), options);
  }

  findByLoginUsername(
    username: string,
    options?: QueryOptions,
  ): UserDocumentQuery {
    if (options && !('select' in options)) {
      options.select = '+login.password';
    } else {
      options = { select: '+login.password' };
    }
    return this.findOne(this.byLoginUsername(username), options);
  }

  findByEmailValue(email: string, options?: QueryOptions): UserDocumentQuery {
    return this.findOne(this.byEmailValue(email), options);
  }

  @UserToEntity()
  @ToObject()
  @Save()
  async update(
    id: string,
    // body: UpdateUserDto,
    body: User,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: QueryOptions,
  ): Promise<User> {
    const user = await this.findById(id, {
      lean: false,
      entity: false,
      select: options?.select === null ? undefined : '+login.password',
    });

    if (options?.select) {
      if (user.login) {
        const userLogin = user.login;
        const bodyLogin = body.login;

        userLogin.originalPassword = userLogin.password;
        userLogin.password = bodyLogin?.newPassword || userLogin.password;
      } else {
        user.login = {
          username: body.login.username,
          password: body.login.currentPassword,
        } as any;
        user.login.currentPassword = body.login.currentPassword;
      }
    }

    merge(user, body);

    return user;
  }

  @ToObject()
  @Save()
  async delete(id: string): Promise<User> {
    const user = await this.findById(id, { lean: false, entity: false });

    user.isDeleted = true;

    return user;
  }
}
