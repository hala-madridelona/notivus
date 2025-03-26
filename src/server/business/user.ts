import { eq, InferSelectModel } from 'drizzle-orm';
import { getDbClient } from '../database/connect';
import { User } from '../database/models/users';
import { throwGracefulError } from '@/utils/error';

type UserQueryPaylaod = {
  email?: string;
  mobile?: string;
};

const createNewUser = async ({
  email,
  mobile,
}: UserQueryPaylaod): Promise<InferSelectModel<typeof User> | null> => {
  try {
    const dbClient = getDbClient();
    const values = {
      email: email ? email : null,
      mobile: mobile ? mobile : null,
    };
    const user = await dbClient?.insert(User).values(values).returning();
    return user?.[0] ?? null;
  } catch (error) {
    return throwGracefulError(createNewUser.name, (error as Error).message);
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
    const dbClient = getDbClient();
    const user = await (email
      ? dbClient?.select().from(User).where(eq(User.email, email))
      : mobile
        ? dbClient?.select().from(User).where(eq(User.mobile, mobile))
        : Promise.resolve([]));

    if (!user || !user.length) {
      return createNewUser({ email, mobile });
    }

    return user[0];
  } catch (error: unknown) {
    return throwGracefulError(fetchUserOrCreateNewUser.name, (error as Error).message);
  }
};

export { fetchUserOrCreateNewUser };
