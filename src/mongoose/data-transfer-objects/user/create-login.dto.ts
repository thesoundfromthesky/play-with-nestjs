import { Login } from '../../schemas';
import { IsString } from 'class-validator';

export class CreateLoginDto implements Login {
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsString()
  passwordConfirmation: string;
  originalPassword: string;
  currentPassword: string;
  newPassword: string;

  _passwordConfirmation: string;
  _originalPassword: string;
  _currentPassword: string;
  _newPassword: string;
}
