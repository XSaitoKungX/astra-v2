import dotenv from 'dotenv';
dotenv.config();

import { log } from './src/utils/logger.js';
import { showFullStartup } from './src/utils/startup.js';
import { connectDatabase, disconnectDatabase } from './src/database/index.js';
import { createBot } from './src/bot/index.js';
import { createAPI } from './src/api/index.js';

const RUN_MODE = process.env.RUN_MODE || 'all';

async function main() {
  // Show startup banner, license, system info
  if (process.env.LOG_SHOW_STARTUP !== 'false') {
    showFullStartup();
  }

  // Connect to database
  try {
    await connectDatabase();
  } catch (error) {
    log.error(`Database connection failed: ${error.message}`, 'DB');
    log.warn('Continuing without database — some features will be unavailable.', 'DB');
  }

  let client = null;

  // Start bot
  if (RUN_MODE === 'all' || RUN_MODE === 'bot') {
    try {
      client = await createBot();
    } catch (error) {
      log.error(`Bot startup failed: ${error.message}`, 'BOT');
      process.exit(1);
    }
  }

  // Start API server
  if (RUN_MODE === 'all' || RUN_MODE === 'api') {
    try {
      createAPI(client);
    } catch (error) {
      log.error(`API startup failed: ${error.message}`, 'API');
    }
  }

  log.info('All systems initialized ✨', 'SYSTEM');
}

// Graceful shutdown
function shutdown(signal) {
  log.info(`${signal} received — shutting down gracefully...`, 'SYSTEM');
  disconnectDatabase().then(() => process.exit(0));
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (error) => {
  log.error(`Unhandled rejection: ${error?.message || error}`, 'SYSTEM');
});

main().catch((error) => {
  log.error(`Fatal error: ${error.message}`, 'SYSTEM');
  process.exit(1);
});
