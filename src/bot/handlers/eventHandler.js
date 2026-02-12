import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { log } from '../../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function loadEvents(client) {
  const eventsPath = join(__dirname, '..', 'events');
  let eventCount = 0;

  try {
    const eventFiles = readdirSync(eventsPath).filter(f => f.endsWith('.js'));

    for (const file of eventFiles) {
      const filePath = join(eventsPath, file);
      const event = await import(`file://${filePath}`);

      if (event.default?.name && event.default?.execute) {
        if (event.default.once) {
          client.once(event.default.name, (...args) => event.default.execute(...args));
        } else {
          client.on(event.default.name, (...args) => event.default.execute(...args));
        }
        eventCount++;
        log.bot(`  → Loaded event: ${event.default.name}`, 'debug');
      }
    }

    log.bot(`Loaded ${eventCount} event(s)`);
  } catch (error) {
    log.bot(`Error loading events: ${error.message}`, 'error');
  }

  return eventCount;
}
