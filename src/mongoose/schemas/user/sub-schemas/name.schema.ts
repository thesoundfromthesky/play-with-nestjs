import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mongooseSchema, Document } from 'mongoose';
import { userCollation } from '../user.schema';

@Schema({ _id: false, id: false })
export class Name {
  @Prop({
    type: String,
    required: [true, 'familyName is required!'],
    match: [/^[a-zA-Z]{2,12}$/, 'Should be 2-12 characters!'],
    immutable: true,
    trim: true,
  })
  familyName: string;

  @Prop({
    type: String,
    required: [true, 'givenName is required!'],
    match: [/^[a-zA-Z]{2,12}$/, 'Should be 2-12 characters!'],
    immutable: true,
    trim: true,
  })
  givenName: string;
}

export interface NameDocument extends Name, Omit<Document, 'id'> {}

export function getNameSchema(): mongooseSchema<Name> {
  const nameSchema = SchemaFactory.createForClass(Name);

  nameSchema.index(
    { familyName: 1 },
    {
      collation: userCollation,
    },
  );
  nameSchema.index(
    { givenName: 1 },
    {
      collation: userCollation,
    },
  );

  return nameSchema;
}
