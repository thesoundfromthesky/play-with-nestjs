import { User, Name, Email, Login } from '../../schemas';
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
  readonly name: Name;

  @Type(() => EmailEntity)
  @Expose()
  readonly emails: Email[];

  @Expose()
  roles: Role[];

  @Type(() => LoginEntity)
  @Expose()
  login: Login;

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
