'use server';

import { throwGracefulError } from '@/utils/error';
import { db } from '../database/connect';
import { Group } from '../database/models/groups';
import { NoteGroupLink } from '../database/models/note-group-link';
import { Tags } from '../database/models/tag';
import { and, count, eq, sql } from 'drizzle-orm';
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

    // Check if note is already in the group
    const existingLink = await db
      .select()
      .from(NoteGroupLink)
      .where(and(eq(NoteGroupLink.noteId, noteId), eq(NoteGroupLink.groupId, groupId as string)));

    if (existingLink && existingLink.length > 0 && existingLink[0].status === 'active') {
      // Note is already in the group, return the existing link
      return existingLink[0];
    }

    if (existingLink.length === 1 && existingLink[0].status !== 'active') {
      const updatedNoteGroupLink = await db
        .update(NoteGroupLink)
        .set({
          status: 'active',
        })
        .where(and(eq(NoteGroupLink.noteId, noteId), eq(NoteGroupLink.groupId, groupId as string)))
        .returning();

      if (!updatedNoteGroupLink || !updatedNoteGroupLink.length) {
        return throwGracefulError(
          addNoteToGroup.name,
          'Failed to link note to group | updating failed'
        );
      }

      return updatedNoteGroupLink[0];
    } else {
      const noteGroupLink = await db
        .insert(NoteGroupLink)
        .values({
          noteId,
          groupId: groupId as string,
        })
        .returning();

      if (!noteGroupLink || noteGroupLink.length === 0) {
        return throwGracefulError(
          addNoteToGroup.name,
          'Failed to link note to group | create failed'
        );
      }

      return noteGroupLink[0];
    }
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
      .where(and(eq(NoteGroupLink.groupId, groupId), eq(NoteGroupLink.status, 'active')))
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
      .leftJoin(
        NoteGroupLink,
        and(eq(Group.id, NoteGroupLink.groupId), eq(NoteGroupLink.status, 'active'))
      )
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

export const findAllTagsInANote = async ({ noteId }: { noteId: string }): Promise<string[]> => {
  if (!noteId) {
    return throwGracefulError(findAllTagsInANote.name, 'Missing required fields');
  }

  try {
    // Find all groups
    const noteGroupLinkResult = await db
      .select({
        noteId: NoteGroupLink.noteId,
        groupId: NoteGroupLink.groupId,
        tagName: Tags.name,
      })
      .from(NoteGroupLink)
      .where(and(eq(NoteGroupLink.noteId, noteId), eq(NoteGroupLink.status, 'active')))
      .leftJoin(Tags, eq(NoteGroupLink.groupId, Tags.groupId));

    if (!noteGroupLinkResult || !noteGroupLinkResult.length) {
      return [];
    }

    const tags = noteGroupLinkResult.map((entry) => entry.tagName ?? '');
    return tags;
  } catch (error) {
    console.error('SWW => ', error);
    return throwGracefulError(findAllTagsInANote.name, (error as Error).message);
  }
};

export const removeNoteLinksForTags = async ({
  noteId,
  tags,
}: {
  noteId: string;
  tags: string[];
}) => {
  if (!noteId || !tags || !tags.length) {
    return throwGracefulError(removeNoteLinksForTags.name, 'Missing required fields');
  }

  try {
    const sqlCommand = sql`
      UPDATE note_group_links ngl
      SET status = 'deleted'
      FROM tags t
      WHERE t.name IN (${sql.join(tags)})
      AND ngl.group_id = t.group_id
      AND ngl.note_id = ${noteId}
      RETURNING ngl.group_id, ngl.note_id, t.name
    `;
    const result = await db.execute(sqlCommand);
    return result;
  } catch (error) {
    console.error('SWW => ', error);
    return throwGracefulError(removeNoteLinksForTags.name, (error as Error).message);
  }
};
