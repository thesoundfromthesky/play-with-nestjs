import { Schema as mongooseSchema, Document } from 'mongoose';
import { passwordPlugin } from '../../../plugins';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { userCollation } from '../user.schema';
import { PasswordPlugin } from 'src/mongoose/interfaces';

@Schema({ _id: false, id: false })
export class Login implements PasswordPlugin {
  @Prop({
    type: String,
    required: [true, 'Username is required!'],
    match: [/^.{4,12}$/, 'Should be 4-12 characters!'],
    trim: true,
    immutable: doc => doc.username,
    // ,unique: true
  })
  username: string;

  @Prop({
    type: String,
    required: [true, 'Password is required!'],
    select: false,
  })
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

export interface LoginDocument
  extends Login,
    LoginMethod,
    Omit<Document, 'id'> {}

export interface LoginMethod {
  authenticate(password: string): boolean;
}

export function getLoginSchema(): mongooseSchema<Login> {
  const loginSchema = SchemaFactory.createForClass(Login);

  loginSchema.plugin(passwordPlugin);

  loginSchema.index(
    { username: 1 },
    {
      unique: true,
      collation: userCollation,
      partialFilterExpression: {
        'login.username': { $exists: true },
      },
    },
  );

  return loginSchema;
}
