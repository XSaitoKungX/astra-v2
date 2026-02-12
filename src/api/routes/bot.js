import { Router } from 'express';

export function createBotRouter(client) {
  const router = Router();

  // GET /api/bot/info — Bot information (all from .env + live data)
  router.get('/info', (req, res) => {
    res.json({
      name: process.env.BOT_NAME || 'Astra',
      version: process.env.BOT_VERSION || '5.0.0',
      status: client?.isReady() ? 'online' : 'offline',
      avatar: client?.user?.displayAvatarURL({ size: 512 }) || null,
      id: client?.user?.id || process.env.DISCORD_CLIENT_ID,
      discriminator: client?.user?.discriminator || '0',
      tag: client?.user?.tag || null,
      createdAt: client?.user?.createdAt || null,
      guilds: client?.guilds?.cache?.size || 0,
      users: client?.guilds?.cache?.reduce((acc, g) => acc + g.memberCount, 0) || 0,
      ping: client?.ws?.ping || 0,
      uptime: client?.uptime || 0,
      links: {
        website: process.env.WEBSITE_URL || null,
        dashboard: process.env.DASHBOARD_URL || null,
        support: process.env.DISCORD_SUPPORT_URL || null,
        invite: process.env.BOT_INVITE_URL || null,
        github: process.env.GITHUB_REPO || null,
        topgg: process.env.TOPGG_URL || null,
      },
    });
  });

  // GET /api/bot/guilds — List of guilds (basic info)
  router.get('/guilds', (req, res) => {
    if (!client?.guilds?.cache) {
      return res.json([]);
    }

    const guilds = client.guilds.cache.map(g => ({
      id: g.id,
      name: g.name,
      icon: g.iconURL({ size: 128 }),
      memberCount: g.memberCount,
      ownerId: g.ownerId,
    }));

    // Sort by member count descending
    guilds.sort((a, b) => b.memberCount - a.memberCount);

    res.json(guilds);
  });

  // GET /api/bot/commands — List of registered commands
  router.get('/commands', (req, res) => {
    if (!client?.commands) {
      return res.json([]);
    }

    const commands = client.commands.map(cmd => ({
      name: cmd.data.name,
      description: cmd.data.description,
      category: cmd.category || 'general',
    }));

    res.json(commands);
  });

  return router;
}
