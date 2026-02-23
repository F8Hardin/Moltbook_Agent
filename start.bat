@echo off
setlocal enabledelayedexpansion

call :run_step "Checking database connectivity" npm run test:db
if errorlevel 1 goto :startup_failed

call :run_step "Running migrations and verifying chat_log" npx tsx server/scripts/run-migrations-check.ts
if errorlevel 1 goto :startup_failed

call :run_step "Checking LM Studio connectivity" npm run test:lmstudio
if errorlevel 1 goto :startup_failed

echo [start] Starting API server
npx tsx server/src/index.ts
exit /b %errorlevel%

:run_step
echo [start] %~1
shift
call %*
exit /b %errorlevel%

:startup_failed
echo Startup failed. Check DATABASE_URL, ensure Postgres is running, and verify LM Studio API is reachable. 1>&2
exit /b 1
