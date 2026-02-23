import { loadConfig } from '../src/config/index.js';
import { createLlmClient, checkLlmConnectivity } from '../src/llm/client.js';

const config = loadConfig();
const client = createLlmClient(config);

await checkLlmConnectivity(client, config.lmStudioModel);
console.log('LM Studio connectivity OK');
