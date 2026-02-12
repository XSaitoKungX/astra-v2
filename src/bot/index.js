import { Client, GatewayIntentBits, Collection, ActivityType } from 'discord.js';
import { log } from '../utils/logger.js';
import { t } from '../i18n/index.js';
import { loadCommands } from './handlers/commandHandler.js';
import { loadEvents } from './handlers/eventHandler.js';
import { MusicManager } from './music/manager.js';

export async function createBot() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent,
    ],
  });

  // Collections
  client.commands = new Collection();
  client.cooldowns = new Collection();

  // Music manager (Lavalink/Shoukaku)
  if (process.env.LAVALINK_HOST) {
    client.music = new MusicManager(client);
    log.bot('Music manager initialized (Lavalink)');
  }

  // Load commands and events
  await loadCommands(client);
  await loadEvents(client);

  // Login
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    log.bot('DISCORD_TOKEN is not set in .env!', 'error');
    throw new Error('Missing DISCORD_TOKEN');
  }

  await client.login(token);
  log.bot(t('startup_ready', { botName: process.env.BOT_NAME || 'Astra' }));

  return client;
}

export default { createBot };
