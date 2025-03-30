import { uuid, timestamp, varchar, pgTable, index, jsonb } from 'drizzle-orm/pg-core';
import { User } from './users';
import { GenericTableStatusEnum } from './common';

export const Note = pgTable(
  'notes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }).default('New Note'),
    content: jsonb('content'),
    userId: uuid('user_id')
      .references(() => User.id)
      .notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    status: GenericTableStatusEnum('status').default('active'),
  },
  (table) => [
    index('notes_user_id_index').on(table.userId),
    index('notes_updated_at_index').on(table.updatedAt),
  ]
);
