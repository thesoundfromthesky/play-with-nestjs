import { Schema, /*SchemaOptions,*/ Document } from 'mongoose';
import { IsDeletedPlugin } from '../interfaces';

export function isDeletedPlugin<T extends IsDeletedPlugin & Document>(
  schema: Schema,
  //   options?: SchemaOptions,
): void {
  schema.path('isDeleted', { type: Boolean, default: false });
}
