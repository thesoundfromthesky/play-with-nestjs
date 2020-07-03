import { Schema } from 'mongoose';
import { AvatarDocumentQuery, AvatarQuery } from './avatar.interfaces';

export function avatarQuery<T extends AvatarQuery & Document>(
  schema: Schema<T>,
  //   options?: SchemaOptions,
): void {
  schema.query.byUserId = function(
    this: AvatarDocumentQuery,
    userId: string,
    isDeleted = false,
  ): AvatarDocumentQuery {
    return this.where('user')
      .equals(userId)
      .where('isDeleted')
      .equals(isDeleted);
  };
}
