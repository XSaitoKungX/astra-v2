import { Router } from 'express';
import { getDatabase } from '../../database/index.js';

export function createStatsRouter(client) {
  const router = Router();

  // GET /api/stats — Real-time bot statistics
  router.get('/', async (req, res) => {
    const guilds = client?.guilds?.cache;
    const guildCount = guilds?.size || 0;
    const userCount = guilds?.reduce((acc, g) => acc + g.memberCount, 0) || 0;
    const channelCount = client?.channels?.cache?.size || 0;

    let commandsUsed = 0;
    try {
      const db = getDatabase();
      const result = await db.commandLog.count();
      commandsUsed = result;
    } catch {
      // DB not available yet
    }

    res.json({
      guilds: guildCount,
      users: userCount,
      channels: channelCount,
      commandsUsed,
      uptime: client?.uptime || 0,
      ping: client?.ws?.ping || 0,
      memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      version: process.env.BOT_VERSION || '5.0.0',
      nodeVersion: process.version,
    });
  });

  // GET /api/stats/history — Stats history from DB
  router.get('/history', async (req, res) => {
    try {
      const db = getDatabase();
      const history = await db.botStats.findMany({
        orderBy: { recordedAt: 'desc' },
        take: 30,
      });
      res.json(history);
    } catch (error) {
      res.json([]);
    }
  });

  return router;
}
