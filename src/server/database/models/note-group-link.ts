import { uuid, pgTable, timestamp, primaryKey, index } from 'drizzle-orm/pg-core';
import { Notes } from './notes';
import { Groups } from './groups';
import { GenericTableStatusEnum } from './common';

export const NoteGroupLinks = pgTable(
  'note_group_links',
  {
    noteId: uuid('note_id')
      .references(() => Notes.id)
      .notNull(),
    groupId: uuid('group_id')
      .references(() => Groups.id)
      .notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    status: GenericTableStatusEnum('status').default('active'),
  },
  (table) => [
    primaryKey({ columns: [table.noteId, table.groupId] }),
    index('note_group_link_note_id_index').on(table.noteId),
    index('note_group_link_group_id_index').on(table.groupId),
  ]
);
