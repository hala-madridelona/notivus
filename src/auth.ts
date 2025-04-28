import NextAuth, { type DefaultSession } from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';

import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

import { Account, User, VerificationToken } from './server/database/models/users';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { getUserDataFromJwtUser } from './server/auth/utils';
import { db } from './server/database/connect';

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string;
    user: {
      /** The user's postal address. */
      address: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession['user'];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db as PostgresJsDatabase, {
    usersTable: User,
    accountsTable: Account,
    verificationTokensTable: VerificationToken,
  }),
  providers: [
    Github,
    Google,
    // Credentials({
    //   id: 'mobile-otp',
    //   credentials: {},
    //   authorize: async (credentials) => {
    //     const { mobileNumber } = credentials as Record<string, string>;
    //     const user = await fetchUserOrCreateNewUser({
    //       mobile: `${INDIA_MOBILE_EXTENSION}${mobileNumber}`,
    //     });
    //     return user;
    //   },
    // }),
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken as string;
      session.user = getUserDataFromJwtUser(token.user);
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
});
