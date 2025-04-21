'use server';

import { throwGracefulError } from '@/utils/error';
import { db } from '../database/connect';
import { Tags } from '../database/models/tag';
import { and, eq, InferSelectModel, isNull } from 'drizzle-orm';

export const createTag = async ({ userId, name }: { userId: string; name: string }) => {
  if (!userId) {
    return throwGracefulError(createTag.name, `userId is not defined`);
  }

  try {
    const trimmedName = name.trim();
    const entryWithName = await db
      .select()
      .from(Tags)
      .where(and(eq(Tags.userId, userId), eq(Tags.name, trimmedName)));
    if (entryWithName?.length) {
      throw new Error(`Tag exists with same name for this user`);
    }

    const dbInsertResult = await db
      .insert(Tags)
      .values({
        name: trimmedName,
        userId,
      })
      .returning();

    if (!dbInsertResult || !dbInsertResult.length) {
      throw new Error(`Something went wrong with insert query`);
    }

    return dbInsertResult?.[0];
  } catch (error) {
    return throwGracefulError(createTag.name, (error as Error).message);
  }
};

export const createOrAddTagForGroup = async ({
  userId,
  groupId,
  name,
}: {
  userId: string;
  name: string;
  groupId: string;
}) => {
  if (!userId) {
    return throwGracefulError(createOrAddTagForGroup.name, `userId is not defined`);
  }

  if (!groupId) {
    return throwGracefulError(createOrAddTagForGroup.name, `groupId is not defined`);
  }

  try {
    const trimmedName = name.trim();

    const entryWithName = await db
      .select()
      .from(Tags)
      .where(and(eq(Tags.userId, userId), eq(Tags.name, trimmedName)));

    // Tag with this name exists
    if (entryWithName?.length) {
      const dbUpdateResult = await db
        .update(Tags)
        .set({
          groupId,
        })
        .where(and(eq(Tags.name, trimmedName), eq(Tags.userId, userId)))
        .returning();

      if (!dbUpdateResult || !dbUpdateResult.length) {
        throw new Error(`Something went wrong with insert query`);
      }

      return dbUpdateResult?.[0];
    } else {
      const dbInsertResult = await db
        .insert(Tags)
        .values({
          name: trimmedName,
          userId,
          groupId,
        })
        .returning();

      if (!dbInsertResult || !dbInsertResult.length) {
        throw new Error(`Something went wrong with insert query`);
      }

      return dbInsertResult?.[0];
    }
  } catch (error) {
    return throwGracefulError(createOrAddTagForGroup.name, (error as Error).message);
  }
};

export const fetchAllTags = async ({ userId }: { userId: string }) => {
  if (!userId) {
    return throwGracefulError(fetchAllTags.name, `userId is not defined`);
  }
  try {
    const groups = await db
      .select()
      .from(Tags)
      .where(and(eq(Tags.userId, userId), eq(Tags.status, 'active')));
    return groups;
  } catch (error) {
    return throwGracefulError(fetchAllTags.name, (error as Error).message);
  }
};

export const fetchAllTagsWithoutGroup = async ({ userId }: { userId: string }) => {
  if (!userId) {
    return throwGracefulError(fetchAllTags.name, `userId is not defined`);
  }
  try {
    const groups = await db
      .select()
      .from(Tags)
      .where(and(eq(Tags.userId, userId), eq(Tags.status, 'active'), isNull(Tags.groupId)));
    return groups;
  } catch (error) {
    return throwGracefulError(fetchAllTags.name, (error as Error).message);
  }
};

type TagTableFields = keyof InferSelectModel<typeof Tags>;

export const updateTag = async ({
  userId,
  tagId,
  field,
  value,
}: {
  userId: string;
  tagId: string;
  field: TagTableFields;
  value: string;
}) => {
  if (!userId) {
    return throwGracefulError(updateTag.name, `userId is not defined`);
  }
  if (!(field in Tags)) {
    return throwGracefulError(updateTag.name, `this field does not exist in Tags table`);
  }
  try {
    const updateQueryResult = await db
      .update(Tags)
      .set({
        [field]: value,
      })
      .where(and(eq(Tags.userId, userId), eq(Tags.id, tagId)))
      .returning();

    if (!updateQueryResult || !updateQueryResult.length) {
      throw new Error(`Something went wrong with update query`);
    }

    return updateQueryResult?.[0];
  } catch (error) {
    return throwGracefulError(fetchAllTags.name, (error as Error).message);
  }
};
