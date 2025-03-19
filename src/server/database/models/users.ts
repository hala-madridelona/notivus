import { uuid, timestamp, varchar, pgTable, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { GenericTableStatusEnum } from './common';

export const UserTypeEnumValues: [string, string] = ['user', 'guest'];
export const UserTypeEnum = pgEnum('user_type', UserTypeEnumValues);

export const Users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  authId: varchar('auth_id', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  profilePicture: varchar('profile_picture', { length: 255 }),
  additionalInfo: jsonb('additional_info'),
  userType: UserTypeEnum('user_type').default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  status: GenericTableStatusEnum('status').default('active'),
});
