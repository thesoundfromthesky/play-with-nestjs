import { DocumentQuery, Document } from 'mongoose';
import { User } from './user.schema';

export interface UserDocument extends User, Omit<Document, 'id'> {}

export interface UserQuery {
  byId(id: string, isDeleted?: boolean): UserDocumentQuery;
  byLoginUsername(username: string, isDeleted?: boolean): UserDocumentQuery;
  byEmailValue(email: string, isDeleted?: boolean): UserDocumentQuery;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserDocumentQuery
  extends DocumentQuery<UserDocument, UserDocument, UserQuery> {}
