import type { Pool } from 'pg';
import type OpenAI from 'openai';
import type { AppConfig } from '../config/index.js';
import { getAgentState, insertChatLog, updateAgentState } from '../db/queries.js';
import { log } from '../shared/logger.js';
import { fetchObservation } from '../moltbook/client.js';

const buildAssistantSummary = (cycleId: number, observation: string, dryRun: boolean): string => {
  return `Cycle ${cycleId}: reviewed observation (${observation}) and ${dryRun ? 'prepared dry-run action' : 'executed action'}.`;
};

export const runSingleCycle = async (pool: Pool, config: AppConfig, _llm: OpenAI): Promise<void> => {
  const state = await getAgentState(pool);
  const cycleId = state.cycle_count + 1;
  const observation = await fetchObservation(config);

  const summary = buildAssistantSummary(cycleId, observation.summary, config.dryRun);
  await insertChatLog(pool, 'assistant', summary, {
    intention: 'observe_and_plan',
    dryRun: config.dryRun,
    actionType: config.dryRun ? 'simulate' : 'execute',
    targetId: observation.targetId,
    status: 'completed',
  });

  await updateAgentState(pool, { cycle_count: cycleId, last_status: 'completed' });
  log('agent', 'cycle_completed', { cycleId, dryRun: config.dryRun, targetId: observation.targetId });
};

export const startAgentLoop = (pool: Pool, config: AppConfig, llm: OpenAI): NodeJS.Timeout => {
  const tick = async (): Promise<void> => {
    const state = await getAgentState(pool);
    if (state.is_paused) return;
    await runSingleCycle(pool, config, llm);
  };

  void tick();
  return setInterval(() => void tick(), config.cycleIntervalMs);
};
