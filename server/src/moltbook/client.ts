import type { AppConfig } from '../config/index.js';

export type Observation = {
  summary: string;
  targetId: string;
};

export const fetchObservation = async (config: AppConfig): Promise<Observation> => {
  if (config.mockMoltbook) {
    return { summary: 'Mock feed observation: new listing price drop', targetId: 'listing-123' };
  }

  const response = await fetch('https://www.moltbook.com/');
  if (!response.ok) {
    throw new Error(`Moltbook fetch failed: ${response.status}`);
  }
  return { summary: 'Fetched moltbook homepage successfully', targetId: 'homepage' };
};
