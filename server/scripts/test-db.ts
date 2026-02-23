import { loadConfig } from '../src/config/index.js';
import { createPool } from '../src/db/pool.js';

const config = loadConfig();
const pool = createPool(config);

try {
  const result = await pool.query('SELECT 1 as ok');
  console.log('DB connectivity OK:', result.rows[0]?.ok === 1);
} finally {
  await pool.end();
}
