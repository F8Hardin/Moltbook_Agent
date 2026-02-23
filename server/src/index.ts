import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig } from './config/index.js';
import { createPool } from './db/pool.js';
import { runMigrations } from './db/migrations.js';
import { createLlmClient } from './llm/client.js';
import { registerRoutes } from './api/routes.js';
import { startAgentLoop } from './agent/loop.js';

const config = loadConfig();
const pool = createPool(config);
await runMigrations(pool);

const app = express();
registerRoutes(app, pool);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/', express.static(path.join(__dirname, 'web')));

const llm = createLlmClient(config);
startAgentLoop(pool, config, llm);

app.listen(config.port, () => {
  console.log(`Server listening on ${config.port}`);
});
