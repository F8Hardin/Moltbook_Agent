import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  port: z.coerce.number().int().positive().default(3000),
  databaseUrl: z.string().min(1),
  lmStudioBaseUrl: z.string().url(),
  lmStudioModel: z.string().min(1),
  dryRun: z.coerce.boolean().default(true),
  mockMoltbook: z.coerce.boolean().default(true),
  cycleIntervalMs: z.coerce.number().int().positive().default(15000),
});

export type AppConfig = z.infer<typeof configSchema>;

export const loadConfig = (): AppConfig => {
  return configSchema.parse({
    port: process.env.PORT,
    databaseUrl: process.env.DATABASE_URL,
    lmStudioBaseUrl: process.env.LMSTUDIO_BASE_URL ?? 'http://127.0.0.1:1234/v1',
    lmStudioModel: process.env.LMSTUDIO_MODEL ?? 'local-model',
    dryRun: process.env.DRY_RUN ?? 'true',
    mockMoltbook: process.env.MOCK_MOLTBOOK ?? 'true',
    cycleIntervalMs: process.env.CYCLE_INTERVAL_MS ?? '15000',
  });
};
