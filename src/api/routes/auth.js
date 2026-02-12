import { Router } from 'express';
import { log } from '../../utils/logger.js';

const DISCORD_API = 'https://discord.com/api/v10';

export function createAuthRouter(client) {
  const router = Router();

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api/auth/discord/callback'
    : (process.env.OAUTH_CALLBACK_URL || 'http://localhost:3000/api/auth/discord/callback');

  // GET /api/auth/discord — Redirect to Discord OAuth2
  router.get('/discord', (req, res) => {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'identify guilds',
    });
    res.redirect(`https://discord.com/oauth2/authorize?${params}`);
  });

  // GET /api/auth/discord/callback — Handle OAuth2 callback
  router.get('/discord/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.redirect('/?error=no_code');

    try {
      // Exchange code for tokens
      const tokenRes = await fetch(`${DISCORD_API}/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenRes.ok) {
        log.api('OAuth2 token exchange failed', 'error');
        return res.redirect('/?error=token_failed');
      }

      const tokens = await tokenRes.json();

      // Fetch user info
      const userRes = await fetch(`${DISCORD_API}/users/@me`, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const user = await userRes.json();

      // Fetch user guilds
      const guildsRes = await fetch(`${DISCORD_API}/users/@me/guilds`, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const guilds = await guildsRes.json();

      // Store in session
      req.session.user = {
        id: user.id,
        username: user.username,
        globalName: user.global_name,
        avatar: user.avatar
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=256`
          : `https://cdn.discordapp.com/embed/avatars/${(BigInt(user.id) >> 22n) % 6n}.png`,
        discriminator: user.discriminator,
      };
      req.session.accessToken = tokens.access_token;
      req.session.refreshToken = tokens.refresh_token;
      req.session.guilds = guilds;

      res.redirect('/dashboard');
    } catch (error) {
      log.api(`OAuth2 error: ${error.message}`, 'error');
      res.redirect('/?error=auth_failed');
    }
  });

  // GET /api/auth/me — Get current user
  router.get('/me', (req, res) => {
    if (!req.session?.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json(req.session.user);
  });

  // GET /api/auth/guilds — Get user's guilds (filtered to manageable + bot presence)
  router.get('/guilds', (req, res) => {
    if (!req.session?.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userGuilds = (req.session.guilds || [])
      .filter(g => (parseInt(g.permissions) & 0x20) === 0x20) // MANAGE_GUILD
      .map(g => {
        const botGuild = client?.guilds?.cache?.get(g.id);
        return {
          id: g.id,
          name: g.name,
          icon: g.icon
            ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.${g.icon.startsWith('a_') ? 'gif' : 'png'}?size=128`
            : null,
          owner: g.owner,
          permissions: g.permissions,
          botPresent: !!botGuild,
          memberCount: botGuild?.memberCount || null,
        };
      })
      .sort((a, b) => (b.botPresent ? 1 : 0) - (a.botPresent ? 1 : 0));

    res.json(userGuilds);
  });

  // GET /api/auth/logout — Destroy session
  router.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  });

  return router;
}
