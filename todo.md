# Astra v5.0.0 — Development Roadmap

## ✅ Phase 1: Foundation (Current)
- [x] Project setup with Bun runtime
- [x] Discord.js v14.25.1 bot core
- [x] Express API server on localhost:3000
- [x] Neon PostgreSQL + Prisma 7 ORM
- [x] Modern logging system (Winston + chalk)
- [x] i18n system (EN/DE)
- [x] License/ToS first-start display
- [x] `/ping` command with latency, uptime, status
- [x] API endpoints: `/api/health`, `/api/stats`, `/api/bot/info`, `/api/bot/guilds`, `/api/bot/commands`
- [x] Vite + React + Tailwind v4 dashboard
- [x] Glassmorphism design system with animations
- [x] Dashboard Home page with live stats from API
- [x] Pelican.dev compatible (index.js entry point)
- [x] `.env`-driven configuration (all dynamic)

## ✅ Phase 2: Core Bot Features
- [x] Moderation system (ban, kick, timeout, warn, clear, slowmode, lock)
- [x] AutoMod (anti-spam, anti-link, anti-invite, bad words, caps filter, emoji filter)
- [x] Logging system (message edits/deletes, member joins/leaves, role changes, voice activity)
- [x] Welcome & goodbye system (custom embeds, auto-role)
- [x] Verification system (button, dropdown, agree rules)
- [x] Self-roles (button, dropdown panels)
- [x] AFK system with mention tracking
- [x] Reminders system
- [x] Setup command (log, modlog, welcome, goodbye, verify channels)
- [x] i18n strings for all new commands (EN/DE)

## ✅ Phase 3: Music System
- [x] Lavalink v4 integration (Shoukaku 4.2.0)
- [x] YouTube, Spotify, SoundCloud, Apple Music, YouTube Music support
- [x] DJ system with role-based permissions
- [x] 20+ audio filters (bassboost, nightcore, 8D, vaporwave, lofi, chipmunk, etc.)
- [x] Lyrics display via lrclib.net API
- [x] Loop modes (off, track, queue)
- [x] Queue management (shuffle, remove, move)
- [x] Core commands: play, stop, skip, pause, nowplaying, queue, volume, filter, lyrics, dj

## 📊 Phase 4: Leveling & Economy
- [ ] XP system (message + voice)
- [ ] Custom rank cards (canvas)
- [ ] Role rewards at specific levels
- [ ] Server leaderboards
- [ ] Economy system (balance, daily, work, rob)
- [ ] Gambling games (slots, blackjack, coinflip)
- [ ] Shop system with custom items
- [ ] Inventory system

## 🎫 Phase 5: Tickets & Giveaways
- [ ] Ticket system (panels, categories, transcripts, auto-close)
- [ ] Staff role assignments & claiming
- [ ] Giveaway system (multiple winners, role requirements, bonus entries)
- [ ] Scheduled giveaways

## 🎙️ Phase 6: Temp Voice
- [ ] Auto-create voice channels
- [ ] Owner controls (lock, hide, rename, limit, kick, ban, bitrate)
- [ ] Permission management

## 🤖 Phase 7: AI Integration
- [ ] Multi-provider AI chatbot (GPT, Claude, Gemini, Llama, Mistral)
- [ ] Free providers: Groq, Together AI, OpenRouter
- [ ] Paid providers: OpenAI, Anthropic, Google AI
- [ ] Per-channel AI configuration
- [ ] Conversation memory

## ✅ Phase 8: Dashboard Expansion
- [x] Complete Landing Page redesign (Hero, Showcase, Features, Why Astra, FAQ, CTA)
- [x] Dashboard i18n system (EN/DE with language switcher)
- [x] TiltCard 3D hover effects on all cards
- [x] Server Showcase with auto-sliding carousel
- [x] Dashboard Showcase (Desktop/Tablet/Mobile mockups)
- [x] Interactive Feature Showcases with tab navigation
- [x] FAQ accordion section
- [x] Redesigned Navbar with language switcher + user avatar/login
- [x] Redesigned Footer with multi-column layout
- [x] Discord OAuth2 login (session-based, /api/auth/*)
- [x] Server management pages (server list + per-server dashboard)
- [x] Moderation settings panel (mod log, warnings list, channel/role config)
- [x] Welcome/verification config (welcome/goodbye channels, verify channel/role)
- [x] AutoMod settings panel (6 toggles: anti-spam, anti-link, anti-invite, bad words, caps, emoji)
- [x] Music settings tab (DJ role, sources, filters, commands overview)
- [x] Analytics & charts (recharts: bar chart, pie chart, stat cards, recent commands)
- [x] Guild management API (settings, automod, stats, warnings, modlog endpoints)

## 📡 Phase 9: Integrations
- [ ] Top.gg voting & webhooks
- [ ] Discord Bot List webhooks
- [ ] DiscordPlace auto-sync
- [ ] Social media notifications (Twitch, YouTube, Twitter/X)
- [ ] Push notifications (VAPID)
- [ ] Email notifications (SMTP)

## 🌐 Phase 10: Production & Polish
- [ ] Redis caching layer
- [ ] Rate limiting
- [ ] Cloudflare Turnstile bot protection
- [ ] API documentation (Swagger)
- [ ] Error tracking & monitoring
- [ ] Performance optimization
- [ ] SEO for dashboard
- [ ] Mobile-responsive dashboard
- [ ] License system for template sales
- [ ] Release & obfuscation scripts

---

## Tech Stack
- **Runtime:** Bun
- **Bot:** Discord.js v14.25.1
- **API:** Express v5
- **Database:** Neon PostgreSQL + Prisma 7
- **Dashboard:** Vite + React + Tailwind CSS v4
- **Design:** Glassmorphism + Framer Motion
- **Icons:** Lucide React
- **Logging:** Winston + Chalk
- **i18n:** Custom (EN, DE)
- **Hosting:** Pelican.dev compatible
