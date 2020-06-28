import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mongooseSchema } from 'mongoose';
import { userCollation } from '../user.schema';

@Schema({ _id: false, id: false })
export class Email {
  @Prop({
    type: String,
    required: [true, 'email is required!'],
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
      'Should be a valid email address!',
    ],
    minlength: [5, 'minlength 5 characters'],
    maxlength: [25, 'maxlength 25 characters'],
    trim: true,
  })
  value: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  verified: boolean;
}

export function getEmailSchema(): mongooseSchema<Email> {
  const emailSchema = SchemaFactory.createForClass(Email);

  emailSchema.index(
    { value: 1 },
    {
      unique: true,
      collation: userCollation,
    },
  );

  emailSchema.pre('save', function(this: any, next) {
    if (this.isModified('value')) {
      this.verified = false;
    }
    return next();
  });

  return emailSchema;
}

export function queryEmailByValue(
  email: string,
  isDeleted = false,
): {
  'emails.value': string;
  isDeleted: boolean;
} {
  return {
    'emails.value': email,
    isDeleted,
  };
}
