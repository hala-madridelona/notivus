'use server';

import { throwGracefulError } from '@/utils/error';
import { db } from '../database/connect';
import { Group } from '../database/models/groups';
import { NoteGroupLink } from '../database/models/note-group-link';
import { Tags } from '../database/models/tag';
import { and, count, eq } from 'drizzle-orm';
import { Note } from '../database/models/notes';

export const addNoteToGroup = async ({ noteId, tagName }: { noteId: string; tagName: string }) => {
  if (!noteId || !tagName) {
    return throwGracefulError(addNoteToGroup.name, 'Missing required fields');
  }

  try {
    const tagGroupRelation = await db
      .select({
        groupId: Group.id,
        tagName: Tags.name,
      })
      .from(Tags)
      .where(eq(Tags.name, tagName))
      .leftJoin(Group, eq(Tags.groupId, Group.id));

    if (!tagGroupRelation || tagGroupRelation.length === 0) {
      return throwGracefulError(
        addNoteToGroup.name,
        `Tag not found with the given name: ${tagName}`
      );
    }

    const { groupId } = tagGroupRelation[0];

    const noteGroupLink = await db
      .insert(NoteGroupLink)
      .values({
        noteId,
        groupId: groupId as string,
      })
      .returning();

    if (!noteGroupLink || noteGroupLink.length === 0) {
      return throwGracefulError(addNoteToGroup.name, 'Failed to link note to group');
    }

    return noteGroupLink[0];
  } catch (error) {
    console.error('SWW => ', error);
    throw new Error('Failed to link note to group');
  }
};

export const fetchNotesInGroup = async ({ groupId }: { groupId: string }) => {
  if (!groupId) {
    return throwGracefulError(fetchNotesInGroup.name, 'Missing required fields');
  }

  try {
    const allNotesInGroup = await db
      .select({
        noteId: Note.id,
        title: Note.title,
        groupId: NoteGroupLink.groupId,
        updatedAt: Note.updatedAt,
      })
      .from(NoteGroupLink)
      .where(eq(NoteGroupLink.groupId, groupId))
      .leftJoin(Note, eq(NoteGroupLink.noteId, Note.id));

    if (!allNotesInGroup) {
      return throwGracefulError(fetchNotesInGroup.name, 'No notes found in the given group');
    }

    return allNotesInGroup;
  } catch (error) {
    console.error('SWW => ', error);
    return throwGracefulError(fetchNotesInGroup.name, (error as Error).message);
  }
};

export const fetchNoteCount = async ({ userId }: { userId: string }) => {
  if (!userId) {
    return throwGracefulError(fetchNoteCount.name, 'Missing required fields');
  }

  try {
    const noteCount = await db
      .select({
        groupId: Group.id,
        noteCount: count(NoteGroupLink.groupId),
      })
      .from(Group)
      .where(and(eq(Group.userId, userId), eq(Group.status, 'active')))
      .leftJoin(NoteGroupLink, eq(Group.id, NoteGroupLink.groupId))
      .groupBy(Group.id);

    if (!noteCount || noteCount.length === 0) {
      return throwGracefulError(fetchNoteCount.name, 'No note count found');
    }

    return noteCount;
  } catch (error) {
    console.error('SWW => ', error);
    return throwGracefulError(fetchNoteCount.name, (error as Error).message);
  }
};
