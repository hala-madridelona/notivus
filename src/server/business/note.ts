'use server';

import { throwGracefulError } from '@/utils/error';
import { and, desc, eq, InferSelectModel } from 'drizzle-orm';
import { Note } from '../database/models/notes';
import { db } from '../database/connect';

export const fetchAllNotes = async ({ userId }: { userId: string }) => {
  if (!userId) {
    return throwGracefulError(fetchAllNotes.name, 'userId is an empty string');
  }

  try {
    const notes = await db
      ?.select()
      .from(Note)
      .where(and(eq(Note.status, 'active'), eq(Note.userId, userId)))
      .orderBy(desc(Note.updatedAt));
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
    const note = await db
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

export const deleteNote = async ({ noteId, userId }: { noteId: string; userId: string }) => {
  if (!userId) {
    return throwGracefulError(deleteNote.name, 'userId is empty');
  }

  try {
    await db
      .update(Note)
      .set({
        status: 'deleted',
      })
      .where(and(eq(Note.id, noteId), eq(Note.userId, userId)));
  } catch (error) {
    return throwGracefulError(deleteNote.name, (error as Error).message);
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
    const updatedRecord = await db
      ?.update(Note)
      .set({
        [field]: value,
        updatedAt: new Date(),
      })
      .where(eq(Note.id, noteId))
      .returning();
    return updatedRecord?.[0];
  } catch (error) {
    return throwGracefulError(updateNote.name, (error as Error).message);
  }
};

export const updateNoteTimestamp = async ({ noteId }: { noteId: string }) => {
  try {
    await db
      ?.update(Note)
      .set({
        updatedAt: new Date(),
      })
      .where(eq(Note.id, noteId));
  } catch (error) {
    return throwGracefulError(updateNoteTimestamp.name, (error as Error).message);
  }
};
