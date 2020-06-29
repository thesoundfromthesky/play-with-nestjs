import { CollationOptions, Schema as mongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DateAtPlugin, IsDeletedPlugin } from 'src/mongoose/interfaces';
import { Role } from 'src/mongoose/enums';
import {
  getEmailSchema,
  Email,
  getLoginSchema,
  Login,
  getNameSchema,
  Name,
} from './sub-schemas';
import { dateAtPlugin, isDeletedPlugin } from 'src/mongoose/plugins';
import { Document } from 'mongoose';

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
  @Prop(getLoginSchema())
  login: Login;

  @Prop({ type: getNameSchema(), required: true })
  name: Name;

  @Prop([getEmailSchema()])
  emails: Email[];

  @Prop({
    type: [String],
    enum: [Role.Admin, Role.User],
    default: Role.User,
  })
  roles: Role[];

  @Prop({ type: Map, of: String, default: {} })
  socialMediaHandles: Map<string, string>;

  @Prop({ type: Date, immutable: true })
  createdAt: Date;

  updatedAt: Date;
  createdDate: string;
  createdTime: string;
  updatedDate: string;
  updatedTime: string;

  id: string;

  isDeleted: boolean;
}

export type UserDoc = User & Document;

export function getUserSchema(): mongooseSchema<User> {
  const userSchema = SchemaFactory.createForClass(User);

  userSchema.plugin(dateAtPlugin);
  userSchema.plugin(isDeletedPlugin);

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

  // schema.path("socialMediaHandles").get(function(this, social) {
  //   if (social instanceof Map && !social.get("google")) {
  //     social.set("google", "");
  //   } else {
  //     social.google = "";
  //   }
  //   return social;
  // });
  // schema.path("roles").get(function(this, roles: Role[]) {
  //   return roles.map(role => {
  //     let level;
  //     switch (role) {
  //       case Role.User:
  //         level = 1;
  //       case Role.Admin:
  //         level = 2;
  //       default:
  //         level = 1;
  //     }
  //     return { role, level };
  //   });
  // });
  //   db.collection.createIndex(
  //     { orderDate: 1, category: 1 },
  //     { name: "date_category_fr", collation: { locale: "en_US", strength: 2 } }
  //  )
  // schema.plugin(namePlugin);

  return userSchema;
}

export function queryUserById(id: string): { _id: string; isDeleted: boolean } {
  return { _id: id, isDeleted: false };
}
