import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { log } from '../utils/logger.js';
import { t } from '../i18n/index.js';
import { createStatsRouter } from './routes/stats.js';
import { createBotRouter } from './routes/bot.js';
import { createHealthRouter } from './routes/health.js';
import { createAuthRouter } from './routes/auth.js';
import { createGuildRouter } from './routes/guild.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..', '..');
const DASHBOARD_DIST = join(PROJECT_ROOT, 'dashboard', 'dist');

export function createAPI(client) {
  const app = express();
  const port = parseInt(process.env.PORT) || 3000;
  const isDev = process.env.NODE_ENV === 'development';

  // Middleware
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));
  app.use(cors({
    origin: isDev ? 'http://localhost:5173' : (process.env.DASHBOARD_URL || '*'),
    credentials: true,
  }));
  app.use(compression());
  app.use(express.json());
  app.use(cookieParser());
  app.use(session({
    secret: process.env.SESSION_SECRET || 'astra-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    },
  }));

  // API Routes
  app.use('/api/auth', createAuthRouter(client));
  app.use('/api/health', createHealthRouter(client));
  app.use('/api/stats', createStatsRouter(client));
  app.use('/api/bot', createBotRouter(client));
  app.use('/api/guild', createGuildRouter(client));

  // API info endpoint
  app.get('/api', (req, res) => {
    res.json({
      name: process.env.BOT_NAME || 'Astra',
      version: process.env.BOT_VERSION || '5.0.0',
      api: 'v1',
      status: 'online',
      documentation: process.env.DOCS_URL || null,
      endpoints: [
        'GET /api/health',
        'GET /api/stats',
        'GET /api/stats/history',
        'GET /api/bot/info',
        'GET /api/bot/guilds',
        'GET /api/bot/commands',
      ],
    });
  });

  // API 404 handler
  app.use('/api/*path', (req, res) => {
    res.status(404).json({ error: t('api_not_found') });
  });

  // Serve dashboard static files (production)
  if (existsSync(DASHBOARD_DIST)) {
    app.use(express.static(DASHBOARD_DIST));

    // SPA fallback — serve index.html for all non-API routes
    app.get('*path', (req, res) => {
      res.sendFile(join(DASHBOARD_DIST, 'index.html'));
    });

    log.dash('Serving dashboard from built files');
  } else {
    log.dash('No dashboard build found — run "bun run build:dashboard" first', 'warn');
  }

  // Error handler
  app.use((err, req, res, next) => {
    log.api(`Error: ${err.message}`, 'error');
    res.status(500).json({ error: t('api_error') });
  });

  // Start server
  app.listen(port, () => {
    log.api(t('startup_api', { port }));
    if (existsSync(DASHBOARD_DIST)) {
      log.dash(`Dashboard available at http://localhost:${port}`);
    }
  });

  return app;
}

export default { createAPI };
