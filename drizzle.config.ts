import type { Config } from 'drizzle-kit';

export default {
  schema: './src/server/database/models',
  dialect: 'postgresql',
  out: './src/server/database/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
} satisfies Config;
