import {
  ValidateNested,
  IsNotEmptyObject,
  ArrayNotEmpty,
} from 'class-validator';

import {
  User,
  LoginDocument,
  EmailDocument,
  NameDocument,
} from '../../schemas';
import { Role } from '../../enums';

import { Type, Transform } from 'class-transformer';

import { selectFirst } from '../../util';
import { EmailDto } from './sub-data-transfer-objects';
import { UpdateLoginDto } from './update-login.dto';

export class UpdateUserDto implements User {
  readonly name: NameDocument;

  @Transform(selectFirst)
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => EmailDto)
  emails: EmailDocument[];

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UpdateLoginDto)
  login: LoginDocument;

  avatar: string;
  socialMediaHandles: Map<string, string>;
  roles: Role[];
  isDeleted: boolean;

  id: string;
  createdAt: Date;
  updatedAt: Date;

  createdDate: string;
  createdTime: string;
  updatedDate: string;
  updatedTime: string;
}
