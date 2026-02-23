import OpenAI from 'openai';
import type { AppConfig } from '../config/index.js';

export const createLlmClient = (config: AppConfig): OpenAI => {
  return new OpenAI({ apiKey: 'lm-studio', baseURL: config.lmStudioBaseUrl });
};

export const checkLlmConnectivity = async (client: OpenAI, model: string): Promise<void> => {
  await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: 'Respond with: ok' }],
    max_tokens: 5,
  });
};
