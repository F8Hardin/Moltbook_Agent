import type { Pool } from 'pg';
import { agentStateRowSchema, chatLogRowSchema, type AgentStateRow, type ChatLogRow } from './schemas.js';

export const getAgentState = async (pool: Pool): Promise<AgentStateRow> => {
  const { rows } = await pool.query('SELECT * FROM agent_state WHERE id = 1');
  return agentStateRowSchema.parse(rows[0]);
};

export const updateAgentState = async (
  pool: Pool,
  fields: Partial<Pick<AgentStateRow, 'is_paused' | 'cycle_count' | 'last_status'>>,
): Promise<void> => {
  await pool.query(
    `UPDATE agent_state
     SET is_paused = COALESCE($1, is_paused),
         cycle_count = COALESCE($2, cycle_count),
         last_status = COALESCE($3, last_status),
         updated_at = now()
     WHERE id = 1`,
    [fields.is_paused ?? null, fields.cycle_count ?? null, fields.last_status ?? null],
  );
};

export const insertChatLog = async (
  pool: Pool,
  role: 'system' | 'assistant',
  content: string,
  meta: Record<string, unknown>,
): Promise<ChatLogRow> => {
  const { rows } = await pool.query(
    `INSERT INTO chat_log (role, content, meta)
     VALUES ($1, $2, $3::jsonb)
     RETURNING *`,
    [role, content, JSON.stringify(meta)],
  );
  return chatLogRowSchema.parse(rows[0]);
};

export const getRecentChats = async (pool: Pool, limit: number): Promise<ChatLogRow[]> => {
  const { rows } = await pool.query(
    `SELECT * FROM chat_log ORDER BY created_at DESC LIMIT $1`,
    [limit],
  );
  return rows.map((row: unknown) => chatLogRowSchema.parse(row));
};
