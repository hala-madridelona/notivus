'use server';

import { throwGracefulError } from '@/utils/error';
import { eq, InferSelectModel } from 'drizzle-orm';
import { getDbClient } from '../database/connect';
import { Note } from '../database/models/notes';

export const fetchAllNotes = async ({ userId }: { userId: string }) => {
  if (!userId) {
    return throwGracefulError(fetchAllNotes.name, 'userId is an empty string');
  }

  try {
    const dbClient = getDbClient();
    const notes = await dbClient?.select().from(Note).where(eq(Note.userId, userId));
    return notes;
  } catch (error) {
    return throwGracefulError(fetchAllNotes.name, (error as Error).message);
  }
};

export const createNote = async ({ userId }: { userId: string }) => {
  if (!userId) {
    return throwGracefulError(createNote.name, 'userId is an empty string');
  }

  try {
    const dbClient = getDbClient();
    const note = await dbClient
      ?.insert(Note)
      .values({
        userId,
      })
      .returning();
    return note?.[0] ?? null;
  } catch (error) {
    return throwGracefulError(createNote.name, (error as Error).message);
  }
};

type NoteFields = keyof InferSelectModel<typeof Note>;

export const updateNote = async ({
  noteId,
  field,
  value,
}: {
  noteId: string;
  field: NoteFields;
  value: string;
}) => {
  if (!(field in Note)) {
    return throwGracefulError(updateNote.name, `This field doesnt exist in Note table`);
  }

  try {
    const db = getDbClient();
    const updatedRecord = await db
      ?.update(Note)
      .set({
        [field]: value,
      })
      .where(eq(Note.id, noteId))
      .returning();
    return updatedRecord?.[0];
  } catch (error) {
    return throwGracefulError(updateNote.name, (error as Error).message);
  }
};
