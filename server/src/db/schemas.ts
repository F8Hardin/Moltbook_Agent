import { z } from 'zod';

export const agentStateRowSchema = z.object({
  id: z.number(),
  is_paused: z.boolean(),
  cycle_count: z.number(),
  last_status: z.string().nullable(),
  updated_at: z.coerce.date(),
});

export const chatLogRowSchema = z.object({
  id: z.number(),
  created_at: z.coerce.date(),
  role: z.enum(['system', 'assistant']),
  content: z.string(),
  meta: z.record(z.unknown()),
});

export type AgentStateRow = z.infer<typeof agentStateRowSchema>;
export type ChatLogRow = z.infer<typeof chatLogRowSchema>;
