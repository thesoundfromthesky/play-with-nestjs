import { CollationOptions, Schema as mongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DateAtPlugin, IsDeletedPlugin } from 'src/mongoose/interfaces';
import { Role } from 'src/mongoose/enums';
import {
  getEmailSchema,
  getLoginSchema,
  getNameSchema,
  LoginDocument,
  EmailDocument,
  NameDocument,
} from './sub-schemas';
import { dateAtPlugin, isDeletedPlugin } from 'src/mongoose/plugins';
import { userQuery } from './user.query';

export const userCollation: CollationOptions = { locale: 'en_US', strength: 2 };

@Schema({
  collation: userCollation,
  toJSON: { virtuals: true },
  // toJSON: { virtuals: false, getters: false },
  toObject: { virtuals: true, getters: true },
  // toObject: { virtuals: true, getters: true },
  timestamps: true,
  // timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  // timestamps: { createdAt: true, updatedAt: false }
  // id: false,
})
export class User implements DateAtPlugin, IsDeletedPlugin {
  @Prop({ type: getLoginSchema() })
  login: LoginDocument;

  @Prop({ type: getNameSchema(), required: true })
  name: NameDocument;

  @Prop([getEmailSchema()])
  emails: EmailDocument[];

  @Prop({
    type: [String],
    enum: [Role.Admin, Role.User],
    default: Role.User,
  })
  roles: Role[];

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: Map, of: String, default: {} })
  socialMediaHandles: Map<string, string>;

  @Prop({ type: Date, immutable: true })
  createdAt: Date;

  id: string;

  updatedAt: Date;
  createdDate: string;
  createdTime: string;
  updatedDate: string;
  updatedTime: string;

  isDeleted: boolean;
}

export function getUserSchema(): mongooseSchema<User> {
  const userSchema = SchemaFactory.createForClass(User);

  // Misc
  userSchema.plugin(dateAtPlugin);
  userSchema.plugin(isDeletedPlugin);

  // Query
  userSchema.plugin(userQuery);

  userSchema.index({ isDeleted: 1 });

  userSchema.index(
    { 'socialMediaHandles.google': 1 },
    {
      unique: true,
      collation: userCollation,
      partialFilterExpression: {
        'socialMediaHandles.google': { $exists: true },
      },
    },
  );

  userSchema.path('login').required(
    function(this /*socialMediaHandles*/) {
      return !(this.socialMediaHandles && this.socialMediaHandles.size);
    } as any,
    'username and password are required to proceed',
  );

  userSchema.path('emails').validate(function(this, emails: []) {
    if (!emails?.length) {
      this.invalidate('emails', 'email is required!');
    }
  });

  return userSchema;
}
