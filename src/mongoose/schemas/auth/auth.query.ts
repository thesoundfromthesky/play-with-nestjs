export function queryAuthByUserId(
  id: string,
  isDeleted = false,
): { user: string; isDeleted: boolean } {
  return { user: id, isDeleted };
}

import { Schema } from 'mongoose';
import { AuthDocumentQuery, AuthQuery } from './auth.interfaces';

export function authQuery<T extends AuthQuery & Document>(
  schema: Schema<T>,
  //   options?: SchemaOptions,
): void {

  schema.query.byUserId = function(
    this: AuthDocumentQuery,
    id: string,
    isDeleted = false,
  ): AuthDocumentQuery {
    return this.where('user')
      .equals(id)
      .where('isDeleted')
      .equals(isDeleted);
  };  
}
