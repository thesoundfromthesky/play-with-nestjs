import { Schema, /* SchemaOptions, */ Document } from 'mongoose';
import { DateAtPlugin } from '../interfaces';
import { getDate, getTime } from '../util';

export function dateAtPlugin<T extends DateAtPlugin & Document>(
  schema: Schema,
  // options?: SchemaOptions,
): void {
  schema.virtual('createdDate').get(function(this: T) {
    return getDate(this.createdAt);
  });

  schema.virtual('createdTime').get(function(this: T) {
    return getTime(this.createdAt);
  });

  schema.virtual('updatedDate').get(function(this: T) {
    return getDate(this.updatedAt);
  });

  schema.virtual('updatedTime').get(function(this: T) {
    return getTime(this.updatedAt);
  });
}
