import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { Group } from './groups';
import { GenericTableStatusEnum } from './common';
import { User } from './users';

export const Tags = pgTable(
  'tags',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    userId: uuid('user_id')
      .references(() => User.id)
      .notNull(),
    groupId: uuid('group_id').references(() => Group.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    status: GenericTableStatusEnum('status').default('active'),
  },
  (table) => [index('tags_user_id_index').on(table.userId), index('tags_name_index').on(table.name)]
);
