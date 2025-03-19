import { pgEnum } from 'drizzle-orm/pg-core';

export const GenericTableStatusEnumValues: [string, string, string] = [
  'active',
  'inactive',
  'deleted',
];
export const GenericTableStatusEnum = pgEnum('status', GenericTableStatusEnumValues);
