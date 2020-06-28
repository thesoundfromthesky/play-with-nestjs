import { Login } from "../../schemas";
import { IsString, IsOptional } from "class-validator";

export class UpdateLoginDto implements Login {
  @IsString()
  @IsOptional()
  username: string;

  password: string;
  
  @IsString()
  currentPassword: string;
  
  @IsString()
  @IsOptional()
  passwordConfirmation: string;
  originalPassword: string;

  @IsString()
  @IsOptional()
  newPassword: string;

  _passwordConfirmation: string;
  _originalPassword: string;
  _currentPassword: string;
  _newPassword: string;
}
