import { Injectable } from '@nestjs/common';
import {
  Avatar,
  AvatarDoc,
  QueryOptions,
  Save,
  User,
  ToObject,
  Lean,
  OrFail,
  Populate,
  queryAvatarByUserId,
  queryAvatarById,
} from 'src/mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseFilterQuery, DocumentQuery } from 'mongoose';
import { Express } from 'express';
import { UserService } from '../user/user.service';
import { ApiConfigService } from 'src/core';

@Injectable()
export class AvatarService {
  constructor(
    @InjectModel(Avatar.name) private readonly avatarModel: Model<AvatarDoc>,
    private readonly userService: UserService,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  get baseUrl(): string {
    return this.apiConfigService.baseUrl;
  }

  @ToObject()
  @Save()
  async create(
    { filename, originalname, mimetype }: Express.Multer.File,
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: QueryOptions,
  ): Promise<AvatarDoc> {
    return new this.avatarModel({
      user: id,
      filename,
      originalname,
      mimetype,
    });
  }

  @OrFail()
  @Lean()
  @Populate()
  findOne(
    query: MongooseFilterQuery<any>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: QueryOptions,
  ): DocumentQuery<AvatarDoc, AvatarDoc, Record<string, unknown>> {
    return this.avatarModel.findOne(query);
  }

  findById(
    id: string,
    options?: QueryOptions,
  ): DocumentQuery<AvatarDoc, AvatarDoc, Record<string, unknown>> {
    return this.findOne(queryAvatarById(id), options);
  }

  findByUserId(
    id: string,
    options?: QueryOptions,
  ): DocumentQuery<AvatarDoc, AvatarDoc, Record<string, unknown>> {
    return this.findOne(queryAvatarByUserId(id), options);
  }

  @ToObject()
  @Save()
  async update(
    id: string,
    { mimetype, originalname, filename }: Express.Multer.File,
  ): Promise<AvatarDoc> {
    const avatar = await this.findByUserId(id, { lean: false });

    avatar.mimetype = mimetype;
    avatar.originalname = originalname;
    avatar.filename = filename;

    return avatar;
  }

  updateUser(id: string, body: User, options?:QueryOptions): Promise<User> {
    return this.userService.update(id, body, options);
  }

  @ToObject()
  @Save()
  async delete(id: string): Promise<Avatar> {
    const avatar = await this.findByUserId(id, { lean: false });

    avatar.isDeleted = true;

    return avatar;
  }
}
