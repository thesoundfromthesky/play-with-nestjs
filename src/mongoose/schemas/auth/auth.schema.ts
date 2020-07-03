import {
  CollationOptions,
  Schema as mongooseSchema,
  Document,
  Types,
} from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { dateAtPlugin, isDeletedPlugin } from '../../plugins';
import { User, UserDocument } from '../user';
import { IsDeletedPlugin, DateAtPlugin } from 'src/mongoose';
import { authQuery } from './auth.query';

export const authCollation: CollationOptions = { locale: 'en_US', strength: 2 };

@Schema({
  toJSON: { virtuals: true },
  // toJSON: { virtuals: false, getters: false },
  toObject: { virtuals: true, getters: true },
  // toObject: { virtuals: true, getters: true },
  timestamps: true,
  // timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  // timestamps: { createdAt: true, updatedAt: false }
  // id: false,
})
export class Auth implements DateAtPlugin, IsDeletedPlugin {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  user: UserDocument;

  @Prop({ type: String })
  refreshToken: string;

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

export function getAuthSchema(): mongooseSchema<Auth> {
  const authSchema = SchemaFactory.createForClass(Auth);

  // Misc
  authSchema.plugin(dateAtPlugin);
  authSchema.plugin(isDeletedPlugin);
  
  // Query
  authSchema.plugin(authQuery);

  authSchema.index({ isDeleted: 1 });

  authSchema.index(
    { user: 1 },
    {
      unique: true,
    },
  );

  return authSchema;
}

