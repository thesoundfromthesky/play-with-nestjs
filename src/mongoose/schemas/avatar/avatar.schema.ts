import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Types,
  CollationOptions,
  Schema as mongooseSchema,
  Document,
} from 'mongoose';
import { dateAtPlugin, isDeletedPlugin } from '../../plugins';
import { User, UserDoc } from '../user';
import { DateAtPlugin, IsDeletedPlugin } from '../../interfaces';

export const avatarCollation: CollationOptions = {
  locale: 'en_US',
  strength: 2,
};

@Schema({
  //   collation: avatarCollation,
  toJSON: { virtuals: true },
  // toJSON: { virtuals: false, getters: false },
  toObject: { virtuals: true, getters: true },
  // toObject: { virtuals: true, getters: true },
  timestamps: true,
  // timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  // timestamps: { createdAt: true, updatedAt: false }
  // id: false,
})
export class Avatar implements DateAtPlugin, IsDeletedPlugin {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  user: UserDoc;

  @Prop({ type: String, required: true })
  originalname: string;

  @Prop({ type: String, required: true })
  filename: string;

  @Prop({ type: String, required: true })
  mimetype: string;

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

export interface AvatarDoc extends Avatar, Omit<Document, 'id'> {}

export function getAvatarSchema(): mongooseSchema<Avatar> {
  const avatarSchema = SchemaFactory.createForClass(Avatar);

  avatarSchema.plugin(dateAtPlugin);
  avatarSchema.plugin(isDeletedPlugin);

  avatarSchema.index({ isDeleted: 1 });

  avatarSchema.index(
    { user: 1 },
    {
      unique: true,
      partialFilterExpression: {
        isDeleted: { $eq: false },
      },
    },
  );
  return avatarSchema;
}

export function queryAvatarById(
  id: string,
  isDeleted = false,
): { _id: string; isDeleted: boolean } {
  return { _id: id, isDeleted };
}

export function queryAvatarByUserId(
  id: string,
  isDeleted = false,
): { user: string; isDeleted: boolean } {
  return { user: id, isDeleted };
}
