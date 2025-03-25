import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

let client: PostgresJsDatabase | null = null;

const loadLocalClient = () => {
  const config = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    maxConnections: 10,
    debug: true,
  };
  const client = postgres(config);
  return drizzle(client);
};

export const getDbClient = () => {
  if (client) return client;
  if (process.env.APP_ENV === 'local') {
    client = loadLocalClient();
  } else {
    // TODO: Add remote client connection
    // throw new Error('Database client not found');
  }

  return client;
};
