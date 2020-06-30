import {
  CollationOptions,
  Schema as mongooseSchema,
  Document,
  Types,
} from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { dateAtPlugin, isDeletedPlugin } from '../../plugins';
import { User, UserDoc } from '../user';
import { IsDeletedPlugin, DateAtPlugin } from 'src/mongoose';

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
  user: UserDoc;

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

export interface AuthDoc extends Auth, Omit<Document, 'id'> {}

export function getAuthSchema(): mongooseSchema<Auth> {
  const authSchema = SchemaFactory.createForClass(Auth);

  authSchema.plugin(dateAtPlugin);
  authSchema.plugin(isDeletedPlugin);

  authSchema.index({ isDeleted: 1 });

  authSchema.index(
    { user: 1 },
    {
      unique: true,
    },
  );

  return authSchema;
}

export function queryAuthByUserId(
  id: string,
  isDeleted = false,
): { user: string; isDeleted: boolean } {
  return { user: id, isDeleted };
}
