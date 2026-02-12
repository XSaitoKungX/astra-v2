import { Router } from 'express';
import { getDatabase } from '../../database/index.js';

export function createHealthRouter(client) {
  const router = Router();

  router.get('/', async (req, res) => {
    const startTime = Date.now();
    let dbStatus = 'disconnected';

    try {
      const db = getDatabase();
      await db.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch {
      dbStatus = 'error';
    }

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      bot: {
        status: client?.isReady() ? 'online' : 'offline',
        ping: client?.ws?.ping || null,
        guilds: client?.guilds?.cache?.size || 0,
      },
      database: {
        status: dbStatus,
        provider: 'neon',
      },
      responseTime: `${Date.now() - startTime}ms`,
    });
  });

  return router;
}
