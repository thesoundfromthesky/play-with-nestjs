import { DocumentQuery, Document } from 'mongoose';
import { Auth } from './auth.schema';

export interface AuthDocument extends Auth, Omit<Document, 'id'> {}

export interface AuthQuery {
  byUserId(id: string, isDeleted?: boolean): AuthDocumentQuery;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AuthDocumentQuery
  extends DocumentQuery<AuthDocument, AuthDocument, AuthQuery> {}
