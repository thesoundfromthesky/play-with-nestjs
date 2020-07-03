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
import { NameDto, EmailDto } from './sub-data-transfer-objects';
import { Type, Transform } from 'class-transformer';
import { selectFirst } from '../../util';
import { CreateLoginDto } from './create-login.dto';

export class CreateUserDto implements User {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => NameDto)
  name: NameDocument;

  @Transform(selectFirst)
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => EmailDto)
  readonly emails: EmailDocument[];

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateLoginDto)
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
