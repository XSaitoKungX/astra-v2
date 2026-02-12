import { Router } from 'express';
import { getDatabase } from '../../database/index.js';
import { log } from '../../utils/logger.js';

function requireAuth(req, res, next) {
  if (!req.session?.user) return res.status(401).json({ error: 'Not authenticated' });
  next();
}

function requireGuildAccess(client) {
  return (req, res, next) => {
    const guildId = req.params.guildId;
    const userGuilds = req.session.guilds || [];
    const userGuild = userGuilds.find(g => g.id === guildId);

    if (!userGuild || (parseInt(userGuild.permissions) & 0x20) !== 0x20) {
      return res.status(403).json({ error: 'No access to this guild' });
    }

    const botGuild = client?.guilds?.cache?.get(guildId);
    if (!botGuild) {
      return res.status(404).json({ error: 'Bot is not in this guild' });
    }

    req.guild = botGuild;
    next();
  };
}

export function createGuildRouter(client) {
  const router = Router();

  // GET /api/guild/:guildId — Guild overview
  router.get('/:guildId', requireAuth, requireGuildAccess(client), async (req, res) => {
    const guild = req.guild;
    const db = getDatabase();

    let settings = null;
    try {
      settings = await db.guild.findUnique({ where: { id: guild.id } });
    } catch { /* ignore */ }

    res.json({
      id: guild.id,
      name: guild.name,
      icon: guild.iconURL({ size: 256 }),
      banner: guild.bannerURL({ size: 1024 }),
      memberCount: guild.memberCount,
      ownerId: guild.ownerId,
      channels: guild.channels.cache
        .filter(c => c.type === 0 || c.type === 2 || c.type === 4)
        .map(c => ({ id: c.id, name: c.name, type: c.type, parentId: c.parentId }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      roles: guild.roles.cache
        .filter(r => r.id !== guild.id)
        .map(r => ({ id: r.id, name: r.name, color: r.hexColor, position: r.position }))
        .sort((a, b) => b.position - a.position),
      settings: settings || {},
    });
  });

  // PATCH /api/guild/:guildId/settings — Update guild settings
  router.patch('/:guildId/settings', requireAuth, requireGuildAccess(client), async (req, res) => {
    const db = getDatabase();
    const guildId = req.params.guildId;
    const allowed = [
      'modLogChannel', 'welcomeChannel', 'goodbyeChannel',
      'logChannel', 'verifyChannel', 'verifyRole', 'muteRole', 'djRole',
    ];

    const data = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        data[key] = req.body[key] || null;
      }
    }

    try {
      const settings = await db.guild.upsert({
        where: { id: guildId },
        update: data,
        create: {
          id: guildId,
          name: req.guild.name,
          icon: req.guild.iconURL(),
          ownerId: req.guild.ownerId,
          ...data,
        },
      });
      res.json(settings);
    } catch (error) {
      log.api(`Settings update error: ${error.message}`, 'error');
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  // GET /api/guild/:guildId/automod — Get automod settings
  router.get('/:guildId/automod', requireAuth, requireGuildAccess(client), async (req, res) => {
    const db = getDatabase();
    try {
      let automod = await db.autoMod.findUnique({ where: { id: req.params.guildId } });
      if (!automod) automod = { id: req.params.guildId, enabled: false };
      res.json(automod);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch automod settings' });
    }
  });

  // PATCH /api/guild/:guildId/automod — Update automod settings
  router.patch('/:guildId/automod', requireAuth, requireGuildAccess(client), async (req, res) => {
    const db = getDatabase();
    const guildId = req.params.guildId;
    const allowed = [
      'enabled', 'antiSpam', 'antiSpamLimit', 'antiSpamInterval',
      'antiLink', 'antiInvite', 'badWords', 'badWordsList',
      'capsFilter', 'capsThreshold', 'emojiFilter', 'emojiLimit',
      'logChannel', 'exemptRoles', 'exemptChannels',
    ];

    const data = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }

    try {
      const automod = await db.autoMod.upsert({
        where: { id: guildId },
        update: data,
        create: { id: guildId, ...data },
      });
      res.json(automod);
    } catch (error) {
      log.api(`AutoMod update error: ${error.message}`, 'error');
      res.status(500).json({ error: 'Failed to update automod settings' });
    }
  });

  // GET /api/guild/:guildId/stats — Guild statistics
  router.get('/:guildId/stats', requireAuth, requireGuildAccess(client), async (req, res) => {
    const db = getDatabase();
    const guildId = req.params.guildId;

    try {
      const [commandCount, warnCount, modActions, recentCommands] = await Promise.all([
        db.commandLog.count({ where: { guildId } }),
        db.warning.count({ where: { guildId } }),
        db.modAction.count({ where: { guildId } }),
        db.commandLog.findMany({
          where: { guildId },
          orderBy: { createdAt: 'desc' },
          take: 50,
          select: { command: true, userId: true, createdAt: true },
        }),
      ]);

      // Command usage breakdown
      const commandBreakdown = {};
      recentCommands.forEach(c => {
        commandBreakdown[c.command] = (commandBreakdown[c.command] || 0) + 1;
      });

      // Activity over last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentActivity = await db.commandLog.findMany({
        where: { guildId, createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      });

      // Group by day
      const dailyActivity = {};
      recentActivity.forEach(r => {
        const day = r.createdAt.toISOString().slice(0, 10);
        dailyActivity[day] = (dailyActivity[day] || 0) + 1;
      });

      res.json({
        totalCommands: commandCount,
        totalWarnings: warnCount,
        totalModActions: modActions,
        memberCount: req.guild.memberCount,
        channelCount: req.guild.channels.cache.size,
        roleCount: req.guild.roles.cache.size,
        commandBreakdown,
        dailyActivity,
        recentCommands: recentCommands.slice(0, 20),
      });
    } catch (error) {
      log.api(`Guild stats error: ${error.message}`, 'error');
      res.status(500).json({ error: 'Failed to fetch guild stats' });
    }
  });

  // GET /api/guild/:guildId/warnings — List warnings
  router.get('/:guildId/warnings', requireAuth, requireGuildAccess(client), async (req, res) => {
    const db = getDatabase();
    try {
      const warnings = await db.warning.findMany({
        where: { guildId: req.params.guildId },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      res.json(warnings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch warnings' });
    }
  });

  // GET /api/guild/:guildId/modlog — List mod actions
  router.get('/:guildId/modlog', requireAuth, requireGuildAccess(client), async (req, res) => {
    const db = getDatabase();
    try {
      const actions = await db.modAction.findMany({
        where: { guildId: req.params.guildId },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      res.json(actions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch mod log' });
    }
  });

  return router;
}
