import {
  uuid,
  timestamp,
  varchar,
  pgTable,
  pgEnum,
  integer,
  primaryKey,
  text,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { GenericTableStatusEnum } from './common';
import type { AdapterAccountType } from 'next-auth/adapters';
import { sql } from 'drizzle-orm';

export const UserTypeEnumValues: [string, string] = ['user', 'guest'];
export const UserTypeEnum = pgEnum('user_type', UserTypeEnumValues);

export const User = pgTable(
  'user',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }),
    image: varchar('profile_picture', { length: 255 }),
    email: varchar('email', { length: 255 }),
    mobile: varchar('mobile', { length: 15 }),
    emailVerified: timestamp('email_verified', { mode: 'date' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    status: GenericTableStatusEnum('status').default('active'),
  },
  (table) => {
    return {
      uniqueEmail: uniqueIndex('unique_email')
        .on(table.email)
        .where(sql`email IS NOT NULL`),
      uniqueMobile: uniqueIndex('unique_mobile')
        .on(table.mobile)
        .where(sql`mobile IS NOT NULL`),
    };
  }
);

export const Account = pgTable(
  'account',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => User.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const VerificationToken = pgTable(
  'verificationToken',
  {
    identifier: varchar('identifier', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);
