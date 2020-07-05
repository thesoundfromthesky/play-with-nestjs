import {
  User,
  LoginDocument,
  EmailDocument,
  NameDocument,
} from '../../schemas';
import { Exclude, Expose, Type } from 'class-transformer';
import { Role } from '../../enums';
import { NameEntity, EmailEntity, LoginEntity } from './sub-entities';

@Exclude()
export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @Type(() => NameEntity)
  @Expose()
  readonly name: NameDocument;

  @Type(() => EmailEntity)
  @Expose()
  readonly emails: EmailDocument[];

  @Expose()
  roles: Role[];

  @Type(() => LoginEntity)
  @Expose()
  login: LoginDocument;

  @Expose()
  avatar: string;

  @Expose()
  socialMediaHandles: Map<string, string>;

  @Expose()
  id: string;

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;

  @Expose()
  createdDate: string;

  @Expose()
  createdTime: string;

  @Expose()
  updatedDate: string;

  @Expose()
  updatedTime: string;
}
