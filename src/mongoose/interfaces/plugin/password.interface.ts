interface PasswordPluginVirtual {
  passwordConfirmation: string;
  originalPassword: string;
  currentPassword: string;
  newPassword: string;

  _passwordConfirmation: string;
  _originalPassword: string;
  _currentPassword: string;
  _newPassword: string;
}

interface PasswordPluginVirtualMethod {
  authenticate?(password: string): boolean;
}

export interface PasswordPlugin
  extends PasswordPluginVirtual,
    PasswordPluginVirtualMethod {
  password: string;
}
