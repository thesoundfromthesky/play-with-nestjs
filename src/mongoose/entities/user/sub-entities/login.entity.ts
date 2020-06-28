import { Login } from '../../../schemas';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LoginEntity implements Login {
  @Expose()
  username: string;

  password: string;

  passwordConfirmation: string;
  originalPassword: string;
  currentPassword: string;
  newPassword: string;
  
  _passwordConfirmation: string;
  _originalPassword: string;
  _currentPassword: string;
  _newPassword: string;
}
