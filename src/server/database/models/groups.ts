import { uuid, text, timestamp, varchar, pgTable, index } from 'drizzle-orm/pg-core';
import { User } from './users';
import { GenericTableStatusEnum } from './common';

export const Group = pgTable(
  'groups',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    userId: uuid('user_id')
      .references(() => User.id)
      .notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    status: GenericTableStatusEnum('status').default('active'),
  },
  (table) => [index('groups_user_id_index').on(table.userId)]
);
