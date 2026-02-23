import type { Express, Request, Response } from 'express';
import { z } from 'zod';
import type { Pool } from 'pg';
import { getRecentChats } from '../db/queries.js';
import { asAppError } from '../shared/errors.js';

const chatResponseSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  role: z.enum(['system', 'assistant']),
  content: z.string(),
  meta: z.record(z.unknown()),
});

const chatsApiResponseSchema = z.object({
  chats: z.array(chatResponseSchema),
});

const sendError = (res: Response, error: unknown): void => {
  const appError = asAppError(error);
  res.status(appError.status).json({
    error: {
      code: appError.code,
      message: appError.message,
      details: appError.details,
    },
  });
};

export const registerRoutes = (app: Express, pool: Pool): void => {
  app.get('/api/chats', async (req: Request, res: Response) => {
    try {
      const limit = z.coerce.number().int().min(1).max(100).default(10).parse(req.query.limit ?? 10);
      const rows = await getRecentChats(pool, limit);
      const response = chatsApiResponseSchema.parse({
        chats: rows.map((row) => ({
          id: row.id,
          createdAt: row.created_at.toISOString(),
          role: row.role,
          content: row.content,
          meta: row.meta,
        })),
      });
      res.json(response);
    } catch (error) {
      sendError(res, error);
    }
  });
};
