import winston from 'winston';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const levelColors = {
  error: chalk.red.bold,
  warn: chalk.yellow.bold,
  info: chalk.cyan.bold,
  debug: chalk.gray.bold,
};

const categoryColors = {
  BOT: chalk.magenta,
  API: chalk.blue,
  DB: chalk.green,
  DASH: chalk.hex('#FF6B6B'),
  SYSTEM: chalk.white,
  I18N: chalk.hex('#FFD93D'),
  LICENSE: chalk.hex('#C084FC'),
};

const consoleFormat = winston.format.printf(({ level, message, category, timestamp }) => {
  const time = chalk.gray(new Date(timestamp).toLocaleTimeString());
  const lvl = (levelColors[level] || chalk.white)(`[${level.toUpperCase()}]`);
  const cat = category
    ? (categoryColors[category] || chalk.white)(`[${category}]`)
    : '';
  return `${time} ${lvl}${cat} ${message}`;
});

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        consoleFormat,
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});

// Helper methods with category support
export const log = {
  info: (message, category = 'SYSTEM') => logger.info(message, { category }),
  warn: (message, category = 'SYSTEM') => logger.warn(message, { category }),
  error: (message, category = 'SYSTEM') => logger.error(message, { category }),
  debug: (message, category = 'SYSTEM') => logger.debug(message, { category }),

  bot: (message, level = 'info') => logger[level](message, { category: 'BOT' }),
  api: (message, level = 'info') => logger[level](message, { category: 'API' }),
  db: (message, level = 'info') => logger[level](message, { category: 'DB' }),
  dash: (message, level = 'info') => logger[level](message, { category: 'DASH' }),
  i18n: (message, level = 'info') => logger[level](message, { category: 'I18N' }),
  license: (message, level = 'info') => logger[level](message, { category: 'LICENSE' }),
};

export default logger;
