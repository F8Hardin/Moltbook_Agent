import { spawnSync } from 'node:child_process';

const run = (command, args) => {
  const res = spawnSync(command, args, { stdio: 'inherit' });
  if (res.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
};

try {
  run('npm', ['run', 'test:db']);
  run('tsx', ['server/scripts/run-migrations-check.ts']);
  run('npm', ['run', 'test:lmstudio']);
  run('tsx', ['server/src/index.ts']);
} catch (error) {
  console.error('Startup failed. Check DATABASE_URL, ensure Postgres is running, and verify LM Studio API is reachable.');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
