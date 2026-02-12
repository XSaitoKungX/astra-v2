import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { log } from '../../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function loadCommands(client) {
  const commandsPath = join(__dirname, '..', 'commands');
  let commandCount = 0;

  try {
    const categories = readdirSync(commandsPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const category of categories) {
      const categoryPath = join(commandsPath, category);
      const commandFiles = readdirSync(categoryPath).filter(f => f.endsWith('.js'));

      for (const file of commandFiles) {
        const filePath = join(categoryPath, file);
        const command = await import(`file://${filePath}`);

        if (command.default?.data && command.default?.execute) {
          client.commands.set(command.default.data.name, command.default);
          commandCount++;
          log.bot(`  → Loaded command: /${command.default.data.name} [${category}]`, 'debug');
        } else {
          log.bot(`  ⚠ Skipped ${file} — missing data or execute`, 'warn');
        }
      }
    }

    log.bot(`Loaded ${commandCount} command(s)`);
  } catch (error) {
    log.bot(`Error loading commands: ${error.message}`, 'error');
  }

  return commandCount;
}
