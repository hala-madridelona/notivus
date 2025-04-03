import { eq, InferSelectModel } from 'drizzle-orm';
import { User } from '../database/models/users';
import { throwGracefulError } from '@/utils/error';
import { db } from '../database/connect';

type UserQueryPaylaod = {
  email?: string;
  mobile?: string;
};

const createNewUser = async ({
  email,
  mobile,
}: UserQueryPaylaod): Promise<InferSelectModel<typeof User> | null> => {
  try {
    const values = {
      email: email ? email : null,
      mobile: mobile ? mobile : null,
    };
    const user = await db?.insert(User).values(values).returning();
    return user?.[0] ?? null;
  } catch (error) {
    return throwGracefulError(createNewUser.name, (error as Error).message);
  }
};

const fetchUserById = async ({ userId }: { userId: string }) => {
  if (!userId) {
    return throwGracefulError(fetchUserById.name, `userId is not defined`);
  }
  try {
    const dbSelectResult = await db.select().from(User).where(eq(User.id, userId));
    if (!dbSelectResult || !dbSelectResult.length) {
      throw new Error(`Something went wrong with select query`);
    }
    return dbSelectResult?.[0];
  } catch (error) {
    return throwGracefulError(fetchUserById.name, (error as Error).message);
  }
};

const fetchUserOrCreateNewUser = async ({
  email,
  mobile,
}: UserQueryPaylaod): Promise<InferSelectModel<typeof User> | null> => {
  if (!email && !mobile) {
    throw new Error('Either email or mobile should be sent');
  }

  try {
    const user = await (email
      ? db?.select().from(User).where(eq(User.email, email))
      : mobile
        ? db?.select().from(User).where(eq(User.mobile, mobile))
        : Promise.resolve([]));

    if (!user || !user.length) {
      return createNewUser({ email, mobile });
    }

    return user[0];
  } catch (error: unknown) {
    return throwGracefulError(fetchUserOrCreateNewUser.name, (error as Error).message);
  }
};

export { fetchUserOrCreateNewUser, fetchUserById };
