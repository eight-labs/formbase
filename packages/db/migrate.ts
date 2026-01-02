import 'dotenv/config';

import { migrate } from 'drizzle-orm/libsql/migrator';

import { db, queryClient } from './index';

await migrate(db, { migrationsFolder: './drizzle' });

await queryClient.close();
