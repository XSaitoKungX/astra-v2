import { ActivityType, Events } from 'discord.js';
import { log } from '../../utils/logger.js';
import { t } from '../../i18n/index.js';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    const botName = process.env.BOT_NAME || 'Astra';
    const guildCount = client.guilds.cache.size;
    const userCount = client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);

    log.bot(t('startup_ready', { botName }));
    log.bot(t('startup_guilds', { count: guildCount }));
    log.bot(`Serving ${userCount.toLocaleString()} user(s)`);

    // Set activity
    client.user.setPresence({
      activities: [{
        name: `${guildCount} servers | /help`,
        type: ActivityType.Watching,
      }],
      status: 'online',
    });
  },
};
