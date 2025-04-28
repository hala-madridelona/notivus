'use server';

import { throwGracefulError } from '@/utils/error';
import { db } from '../database/connect';
import { Group } from '../database/models/groups';
import { and, count, eq } from 'drizzle-orm';
import { withDependencyOn } from '@/utils/higher-order-funcs';
import { fetchUserById } from './user';
import { NoteGroupLink } from '../database/models/note-group-link';

export const createGroup = async ({
  userId,
  name,
  description,
}: {
  userId: string;
  name: string;
  description: string;
}) => {
  if (!userId) {
    return throwGracefulError(createGroup.name, `userId is not defined`);
  }

  try {
    const trimmedName = name.trim();
    const entryWithName = await db
      .select()
      .from(Group)
      .where(and(eq(Group.userId, userId), eq(Group.name, trimmedName)));
    const trimmedDescription = description ? description.trim() : '';
    if (entryWithName?.length) {
      throw new Error(`Group exists with same name`);
    }

    const dbInsertResult = await db
      .insert(Group)
      .values({
        name: trimmedName,
        userId,
        description: trimmedDescription,
      })
      .returning();

    if (!dbInsertResult || !dbInsertResult.length) {
      throw new Error(`Something went wrong with insert query`);
    }

    return dbInsertResult?.[0];
  } catch (error) {
    return throwGracefulError(createGroup.name, (error as Error).message);
  }
};

export const fetchGroups = async ({ userId }: { userId: string }) => {
  if (!userId) {
    return throwGracefulError(fetchGroups.name, `userId is not defined`);
  }
  try {
    const groups = await db
      .select({
        id: Group.id,
        name: Group.name,
        description: Group.description,
        userId: Group.userId,
        createdAt: Group.createdAt,
        updatedAt: Group.updatedAt,
        status: Group.status,
        noteCount: count(NoteGroupLink.groupId),
      })
      .from(Group)
      .where(and(eq(Group.userId, userId), eq(Group.status, 'active')))
      .leftJoin(NoteGroupLink, eq(Group.id, NoteGroupLink.groupId))
      .groupBy(Group.id);

    if (!groups || groups.length === 0) {
      return throwGracefulError(fetchGroups.name, 'No groups found');
    }

    return groups;
  } catch (error) {
    return throwGracefulError(fetchGroups.name, (error as Error).message);
  }
};

export const deleteGroup = async ({ userId, groupId }: { userId: string; groupId: string }) => {
  if (!userId) {
    return throwGracefulError(fetchGroups.name, `userId is not defined`);
  }
  try {
    await db
      .update(Group)
      .set({
        status: 'deleted',
      })
      .where(and(eq(Group.id, groupId), eq(Group.userId, userId)));
  } catch (error) {
    return throwGracefulError(deleteGroup.name, (error as Error).message);
  }
};

export const fetchGroupsSafe = withDependencyOn(fetchGroups, fetchUserById);
export const createGroupSafe = withDependencyOn(createGroup, fetchUserById);
export const deleteGroupSafe = withDependencyOn(deleteGroup, fetchUserById);
