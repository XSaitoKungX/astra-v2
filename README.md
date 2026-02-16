<div align="center">

<img src="dashboard/public/astra-avatar.png" alt="Astra" width="140" height="140" style="border-radius: 50%;" />

# Astra v2 — Premium All-in-One Discord Bot

**The most feature-rich Discord bot template with a stunning glassmorphism dashboard.**

[![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?logo=discord&logoColor=white)](https://discord.js.org)
[![Express](https://img.shields.io/badge/Express-v5-000?logo=express)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://prisma.io)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#-license)

[Features](#-features) · [Dashboard](#-dashboard) · [Tech Stack](#-tech-stack) · [Purchase](#-purchase) · [Support](#-support)

---

> **⚠️ This is a showcase repository.** The source code is not included here.
> To get the full bot, purchase a license at **[store.novaplex.xyz](https://store.novaplex.xyz)**.

</div>

---

## ✨ Features

### 🤖 Bot — 48+ Slash Commands

| Category | Highlights |
|----------|-----------|
| **Moderation** | AutoMod engine (anti-spam, anti-link, anti-invite, bad words, caps & emoji filter), warnings, kicks, bans, timeouts, mod log, audit log |
| **Leveling** | Message & voice XP tracking, custom rank cards (themes, colors, backgrounds), leaderboards, level-up announcements, role rewards, XP multipliers |
| **Economy** | Full currency system — daily rewards, work, robbery, banking with interest, custom shop items, inventory, streaks |
| **Music** | Lavalink-powered — YouTube, Spotify, SoundCloud, platform selection, auto-fallback, queue management, filters, 24/7 mode, DJ roles, **Discord.js Components v2 UI** |
| **Welcome** | Custom welcome/leave messages with embed builder, auto-roles, member screening |
| **Tickets** | Ticket system with categories, transcripts, staff roles, auto-close timers |
| **Temp Voice** | Dynamic voice channels — custom names, user limits, permissions |
| **Giveaways** | Timed giveaways, role requirements, multiple winners, rerolls, **Discord.js Components v2 UI** |
| **Reaction Roles** | Button roles, dropdown menus, reaction roles with custom embeds |
| **AI** | AI-powered chat, image generation, conversation memory |
| **Security** | Anti-raid, verification, Cloudflare Turnstile bot protection |

### 🎨 Dashboard — Full Web Management

- **Glassmorphism UI** — Modern anime-inspired design with Framer Motion animations
- **Complete Server Management** — Configure every bot feature from the browser
- **Custom Rank Cards** — Live preview editor with themes, colors, and backgrounds
- **User Profiles** — Customizable profiles with stats, badges, and social links
- **Server Profiles** — Public server pages with leaderboards and team display
- **Global Leaderboards** — Cross-server rankings for XP and economy
- **Embed Builder** — Visual editor for welcome/level-up messages
- **Shop Manager** — Create and manage economy items with drag-and-drop
- **Bot Owner Panel** — Owner-only settings page for bot name, language, status, activity, rotation
- **Activity Rotation** — Cycle through multiple activities with placeholders ({servers}, {users}, {ping}, etc.)
- **Mobile Responsive** — Fully optimized for all screen sizes
- **Multi-Language** — i18n support (English, German, more coming)
- **SEO Optimized** — Open Graph, Twitter Cards, meta tags

---

## 🖼 Dashboard Preview

<div align="center">

*Screenshots coming soon — or visit the live demo at [astra-bot.app](https://astra-bot.app)*

</div>

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | [Bun](https://bun.sh) (Node.js 20+ compatible) |
| **Bot Framework** | [Discord.js v14](https://discord.js.org) with **Components v2** |
| **API Server** | [Express v5](https://expressjs.com) |
| **Database** | [PostgreSQL](https://www.postgresql.org) (Neon) + [Prisma 7](https://prisma.io) |
| **Cache** | [Redis](https://redis.io) via ioredis (optional) |
| **Dashboard** | [Vite](https://vite.dev) + [React 19](https://react.dev) + [Tailwind CSS v4](https://tailwindcss.com) |
| **Animations** | [Framer Motion](https://motion.dev) |
| **Charts** | [Recharts](https://recharts.org) |
| **Music** | [Lavalink](https://lavalink.dev) via [Shoukaku](https://github.com/Deivu/Shoukaku) |
| **Logging** | [Winston](https://github.com/winstonjs/winston) with log rotation |
| **Security** | Helmet, CSP, HSTS, rate limiting, Cloudflare Turnstile |
| **License** | [Novaplex License System](https://license.novaplex.xyz) |

---

## � What's Included

When you purchase Astra v2, you receive:

```
astra-v2/
├── index.js                  # Entry point with license validation
├── package.json              # Dependencies and scripts
├── .env.example              # Full configuration template
├── README.md                 # Setup guide
├── prisma/
│   └── schema.prisma         # Database schema (30+ models)
├── src/
│   ├── api/                  # Express API server (routes, middleware, security)
│   ├── bot/                  # Discord.js bot (48+ commands, 11 events)
│   ├── cache/                # Redis caching layer
│   ├── database/             # Prisma client
│   ├── i18n/                 # Internationalization (en, de)
│   └── utils/                # Logger, license, helpers
└── dashboard/                # React + Vite frontend (full source)
    ├── src/                  # Components, pages, i18n
    └── public/               # Static assets
```

---

## 🔒 Security & Production-Ready

Astra is built for production from day one:

- **Helmet** — Strict CSP, HSTS, X-Frame-Options
- **Rate Limiting** — 100 req/min API, 10 req/min auth
- **Session Security** — Secure cookies, strict SameSite, PostgreSQL session store
- **OAuth2** — Enforced callback URLs, no localhost fallbacks
- **Cloudflare Turnstile** — Bot protection for sensitive routes
- **Redis Caching** — API response caching with graceful fallback
- **Log Rotation** — Winston with 5MB file rotation, exception handlers
- **License Validation** — Hardware-bound with periodic re-validation

---

## � Purchase

<div align="center">

### Get Astra v2 — The Ultimate Discord Bot Template

| | Lifetime License |
|---|---|
| **Price** | Contact for pricing |
| **Updates** | Lifetime |
| **Support** | Discord community |
| **License** | 1 machine, hardware-bound |
| **Source Code** | Full, unobfuscated |

**[🛒 Purchase at store.novaplex.xyz](https://store.novaplex.xyz)**

</div>

### What you get:
- ✅ Full source code (bot + dashboard + API)
- ✅ Lifetime license key
- ✅ Setup documentation
- ✅ Discord support community
- ✅ Future updates

### Requirements:
- [Bun](https://bun.sh) v1.0+ or Node.js 20+
- [PostgreSQL](https://www.postgresql.org) database (free tier on [Neon](https://neon.tech))
- [Discord Application](https://discord.com/developers/applications)
- VPS or hosting (e.g. Hetzner, DigitalOcean)

---

## 📜 License

**This software is proprietary and requires a valid license to operate.**

- A valid license key from [Novaplex](https://store.novaplex.xyz) is **required** to run the bot
- Each license is **hardware-bound** to a single machine
- **No redistribution** — you may not share, resell, or redistribute this software
- **No tampering** — modifying or removing the license system is prohibited

See the [LICENSE](LICENSE) file for full terms.

---

## 🤝 Support

- **Discord** — [discord.gg/KD84DmNA89](https://discord.gg/KD84DmNA89)
- **Website** — [eziox.link/saito](https://eziox.link/saito)
- **GitHub Issues** — For bug reports (licensed users only)
- **Email** — Contact via Discord

---

<div align="center">

**Built with ❤️ by [XSaitoKungX](https://github.com/XSaitoKungX)**

</div>
