import { DocumentQuery, Document } from 'mongoose';
import { Avatar } from './avatar.schema';

export interface AvatarDocument extends Avatar, Omit<Document, 'id'> {}

export interface AvatarQuery {
  byUserId(userId: string, isDeleted?: boolean): AvatarDocumentQuery;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AvatarDocumentQuery
  extends DocumentQuery<AvatarDocument, AvatarDocument, AvatarQuery> {}
