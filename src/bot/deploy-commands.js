import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { log } from '../utils/logger.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commands = [];
const commandsPath = join(__dirname, 'commands');

const categories = readdirSync(commandsPath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

for (const category of categories) {
  const categoryPath = join(commandsPath, category);
  const commandFiles = readdirSync(categoryPath).filter(f => f.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = join(categoryPath, file);
    const command = await import(`file://${filePath}`);
    if (command.default?.data) {
      commands.push(command.default.data.toJSON());
    }
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
  log.bot(`Deploying ${commands.length} command(s)...`);

  const guildId = process.env.DISCORD_GUILD_ID;

  if (guildId) {
    // Guild-specific (instant)
    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, guildId),
      { body: commands },
    );
    log.bot(`Deployed ${commands.length} command(s) to guild ${guildId}`);
  } else {
    // Global (up to 1 hour propagation)
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands },
    );
    log.bot(`Deployed ${commands.length} global command(s)`);
  }
} catch (error) {
  log.bot(`Failed to deploy commands: ${error.message}`, 'error');
  process.exit(1);
}
