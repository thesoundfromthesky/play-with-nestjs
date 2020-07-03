import { Schema, /*SchemaOptions,*/ Document } from 'mongoose';
import { NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';
import { PasswordPlugin } from '../interfaces';

export function passwordPlugin<T extends PasswordPlugin & Document>(
  schema: Schema,
  //   options?: SchemaOptions,
): void {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
  const passwordRegexErrorMessage =
    'Should be minimum 8 characters of alphabet and number combination!';
  
  schema.path('password').validate(function(this: T /*v: string*/) {
    
    // create user
    if (this.isNew) {
      if (!this.passwordConfirmation) {
        this.invalidate(
          'passwordConfirmation',
          'Password Confirmation is required!',
        );
      }
      if (!passwordRegex.test(this.password)) {
        this.invalidate('password', passwordRegexErrorMessage);
      } else if (this.password !== this.passwordConfirmation) {
        this.invalidate(
          'passwordConfirmation',
          'Password Confirmation does not matched!',
        );
      }
    }

    // update user
    if (!this.isNew && this.isDirectSelected("login.password")) {
      if (!this.currentPassword) {
        this.invalidate('currentPassword', 'Current Password is required!');
      }
      if (
        this.currentPassword &&
        this.originalPassword &&
        !bcrypt.compareSync(this.currentPassword, this.originalPassword)
      ) {
        this.invalidate('currentPassword', 'Current Password is invalid!');
      }
      if (this.newPassword && !passwordRegex.test(this.newPassword)) {
        this.invalidate('newPassword', passwordRegexErrorMessage);
      } else if (this.newPassword !== this.passwordConfirmation) {
        this.invalidate(
          'passwordConfirmation',
          'Password Confirmation does not matched!',
        );
      }
    }
  });

  schema
    .virtual('passwordConfirmation')
    .get(function(this: T) {
      return this._passwordConfirmation;
    })
    .set(function(this: T, value: string) {
      this._passwordConfirmation = value;
    });

  schema
    .virtual('originalPassword')
    .get(function(this: T) {
      return this._originalPassword;
    })
    .set(function(this: T, value: string) {
      this._originalPassword = value;
    });

  schema
    .virtual('currentPassword')
    .get(function(this: T) {
      return this._currentPassword;
    })
    .set(function(this: T, value: string) {
      this._currentPassword = value;
    });

  schema
    .virtual('newPassword')
    .get(function(this: T) {
      return this._newPassword;
    })
    .set(function(this: T, value: string) {
      this._newPassword = value;
    });

  schema.methods.authenticate = function(this: T, password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  };

  schema.pre('save', function(this: T, next: NextFunction) {

    if (this.isModified('password')) {
      this.password = bcrypt.hashSync(this.password);
    }
    return next();
  });
}
