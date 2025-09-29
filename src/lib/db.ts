import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../../drizzle/schema';

export function getDatabase(env: any) {
  if (!env?.DB) {
    throw new Error('D1 database binding not found');
  }
  return drizzle(env.DB, { schema });
}

export type Database = ReturnType<typeof getDatabase>;
export { schema };