# Database Setup + Push Cheat Sheet

Quick SQL + terminal commands to set up PostgreSQL for this project and push your changes.

## 1) Create DB user + database (PostgreSQL)

```sql
-- open psql as a superuser first:
-- psql -U postgres

CREATE USER moltbook_user WITH PASSWORD 'change_me';
CREATE DATABASE moltbook_agent OWNER moltbook_user;
GRANT ALL PRIVILEGES ON DATABASE moltbook_agent TO moltbook_user;
```

## 2) Set the connection string

```bash
export DATABASE_URL="postgresql://moltbook_user:change_me@localhost:5432/moltbook_agent"
```

(Or put the same value in a `.env` file.)

## 3) Install dependencies

```bash
npm install
```

## 4) Verify DB connection

```bash
npm run test:db
```

## 5) Push schema/migrations

This app runs migrations automatically on startup.

```bash
npm run dev
```

That executes `runMigrations(...)`, which creates:
- `agent_state`
- `chat_log`

## 6) Optional: verify tables in psql

```sql
\dt
SELECT * FROM agent_state;
SELECT count(*) FROM chat_log;
```

## 7) Push your code changes

```bash
git add .
git commit -m "Add DB cheat sheet"
git push origin <your-branch>
```
