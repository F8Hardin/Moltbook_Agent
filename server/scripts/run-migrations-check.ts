import { loadConfig } from '../src/config/index.js';
import { createPool } from '../src/db/pool.js';
import { runMigrations, verifyChatLogTable } from '../src/db/migrations.js';

const config = loadConfig();
const pool = createPool(config);

try {
  await runMigrations(pool);
  const hasTable = await verifyChatLogTable(pool);
  if (!hasTable) {
    throw new Error('chat_log table missing after migration');
  }
  console.log('Migrations OK and chat_log exists');
} finally {
  await pool.end();
}
