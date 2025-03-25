import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';

import Github from 'next-auth/providers/github';

import { getDbClient } from './server/database/connect';
import { Account, User, VerificationToken } from './server/database/models/users';

const db = getDbClient();

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
  adapter: DrizzleAdapter(db, {
    usersTable: User,
    accountsTable: Account,
    verificationTokensTable: VerificationToken,
  }),
  providers: [
    Github,
    Credentials({
      id: 'mobile-otp',
      credentials: {},
      authorize: async (credentials) => {
        const { phoneNumber } = credentials as Record<string, string>;
        // TODO: Fetch user from database
        return { id: '1', name: 'Shashank Shekhar', mobile: phoneNumber };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken as string;
      session.user.id = token.id as string;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
});
