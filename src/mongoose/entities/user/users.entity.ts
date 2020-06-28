import { UserEntity } from './user.entity';
import { Type } from 'class-transformer';

export class UsersEntity {
  constructor(partial: Partial<UsersEntity>) {
    Object.assign(this, partial);
  }

  @Type(() => UserEntity)
  users: UserEntity[];

  maxPage: number;
  currentPage: number;
  limit: number;
}
