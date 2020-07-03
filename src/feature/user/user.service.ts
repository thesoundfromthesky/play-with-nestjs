import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, DocumentQuery, MongooseFilterQuery } from 'mongoose';
import {
  User,
  UserDoc,
  QueryOptions,
  queryLoginByUsername,
  queryEmailByValue,
  queryUserById,
} from 'src/mongoose';
import { CreateUserDto, UpdateUserDto } from 'src/mongoose';
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
    @InjectModel(User.name) private readonly userModel: Model<UserDoc>,
  ) {}

  @UserToEntity()
  @ToObject()
  @Save()
  async create(
    createUserDto: CreateUserDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: QueryOptions,
  ): Promise<UserDoc> {
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
    query: MongooseFilterQuery<any>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: QueryOptions,
  ): DocumentQuery<UserDoc, UserDoc, Record<string, unknown>> {
    return this.userModel.findOne(query);
  }

  findById(
    id: string,
    options?: QueryOptions,
  ): DocumentQuery<UserDoc, UserDoc, Record<string, unknown>> {
    return this.findOne(queryUserById(id), options);
  }

  findOneByUsername(
    username: string,
    options?: QueryOptions,
  ): DocumentQuery<UserDoc, UserDoc, Record<string, unknown>> {
    if (options) {
      if (!('select' in options)) {
        options.select = '+login.password';
      }
    } else {
      options = { select: '+login.password' };
    }

    return this.findOne(queryLoginByUsername(username), options);
    // return this.userModel
    //   .findOne({ 'login.username': { $eq: username, $exists: true } })
    //   .select('+login.password');
    // const user = await this.userModel
    //   .findOne({ 'login.username': { $eq: username, $exists: true } })
    //   .select('+login.password')
    //   .lean({ virtuals: true, getters: true, defaults: true })
    //   .orFail();
    // return user;
  }

  findOneByEmail(
    email: string,
    options?: QueryOptions,
  ): DocumentQuery<UserDoc, UserDoc, Record<string, unknown>> {
    return this.findOne(queryEmailByValue(email), options);

    // const user = this.userModel.findOne({
    //   'emails.value': email,
    //   isDeleted: false,
    // });
    // return user;
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
    // const user = await this.userModel
    //   .findOne({ _id: id, isDeleted: false })
    //   .select('+login.password')
    //   .orFail();

    const user = await this.findById(id, {
      lean: false,
      entity: false,
      select: '+login.password',
    });

    if (user.login) {
      const userLogin = user.login;
      const bodyLogin = body.login;

      userLogin.originalPassword = userLogin.password;
      userLogin.password = bodyLogin?.newPassword
        ? bodyLogin.newPassword
        : userLogin.password;
    } else {
      user.login = {
        username: body.login.username,
        password: body.login.currentPassword,
      } as any;
      user.login.currentPassword = body.login.currentPassword;
    }

    merge(user, body);

    return user;
  }

  @ToObject()
  @Save()
  async delete(id: string): Promise<User> {
    // const user = await this.userModel
    //   .findOne({
    //     _id: id,
    //     isDeleted: false,
    //   })
    //   .orFail();
    const user = await this.findById(id, { lean: false, entity: false });

    user.isDeleted = true;

    return user;
  }
}
