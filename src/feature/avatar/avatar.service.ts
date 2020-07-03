import { Injectable } from '@nestjs/common';
import {
  Avatar,
  QueryOptions,
  Save,
  User,
  ToObject,
  Lean,
  OrFail,
  Populate,
  AvatarDocumentQuery,
  AvatarQuery,
  AvatarDocument,
} from 'src/mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseFilterQuery } from 'mongoose';
import { Express } from 'express';
import { UserService } from '../user/user.service';
import { ApiConfigService } from 'src/core';

@Injectable()
export class AvatarService {
  constructor(
    @InjectModel(Avatar.name)
    private readonly avatarModel: Model<AvatarDocument, AvatarQuery>,
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
  ): Promise<AvatarDocument> {
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
  ): AvatarDocumentQuery {
    return this.avatarModel.findOne(query);
  }

  // findById(id: string, options?: QueryOptions): AvatarDocumentQuery {
  //   return this.findOne(queryAvatarById(id), options);
  // }

  byUserId(userId: string): AvatarDocumentQuery {
    return this.avatarModel.findOne().byUserId(userId);
  }

  findByUserId(userId: string, options?: QueryOptions): AvatarDocumentQuery {
    return this.findOne(this.byUserId(userId), options);
  }

  @ToObject()
  @Save()
  async update(
    userId: string,
    { mimetype, originalname, filename }: Express.Multer.File,
  ): Promise<AvatarDocument> {
    const avatar = await this.findByUserId(userId, { lean: false });

    avatar.mimetype = mimetype;
    avatar.originalname = originalname;
    avatar.filename = filename;

    return avatar;
  }

  updateUser(userId: string, body: User, options?: QueryOptions): Promise<User> {
    return this.userService.update(userId, body, options);
  }

  @ToObject()
  @Save()
  async delete(userId: string): Promise<Avatar> {
    const avatar = await this.findByUserId(userId, { lean: false });

    avatar.isDeleted = true;

    return avatar;
  }
}
