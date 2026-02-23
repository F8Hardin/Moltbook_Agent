import type { Pool } from 'pg';

const statements = [
  `CREATE TABLE IF NOT EXISTS agent_state (
    id INTEGER PRIMARY KEY DEFAULT 1,
    is_paused BOOLEAN NOT NULL DEFAULT FALSE,
    cycle_count INTEGER NOT NULL DEFAULT 0,
    last_status TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT now()
  );`,
  `INSERT INTO agent_state (id) VALUES (1) ON CONFLICT (id) DO NOTHING;`,
  `CREATE TABLE IF NOT EXISTS chat_log (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    role TEXT NOT NULL CHECK (role IN ('system','assistant')),
    content TEXT NOT NULL,
    meta JSONB NOT NULL DEFAULT '{}'::jsonb
  );`,
  `CREATE INDEX IF NOT EXISTS idx_chat_log_created_at_desc ON chat_log (created_at DESC);`,
];

export const runMigrations = async (pool: Pool): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const statement of statements) {
      await client.query(statement);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const verifyChatLogTable = async (pool: Pool): Promise<boolean> => {
  const { rows } = await pool.query<{ exists: boolean }>(
    `SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'chat_log'
    ) as exists`,
  );
  return rows[0]?.exists === true;
};
