import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiServer, HiUsers, HiTerminal, HiClock, HiArrowRight, HiShieldCheck,
  HiMusicNote, HiChat, HiStar, HiLightningBolt, HiChevronDown,
  HiDesktopComputer, HiDeviceMobile, HiLockClosed, HiGlobe, HiHeart,
  HiChartBar, HiColorSwatch, HiTicket
} from 'react-icons/hi'
import {
  RiGamepadLine, RiMicLine, RiRobotLine, RiSparklingLine,
  RiTabletLine, RiHeadphoneLine, RiTrophyLine, RiPaletteLine
} from 'react-icons/ri'
import { SiGithub } from 'react-icons/si'
import { useApi } from '../hooks/useApi.js'
import { useI18n } from '../i18n/useI18n.js'
import Navbar from '../components/Navbar.jsx'
import TiltCard from '../components/TiltCard.jsx'
import Footer from '../components/Footer.jsx'

function formatUptime(ms) {
  if (!ms || ms < 0) return '0s'
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (d > 0) return `${d}d ${h % 24}h`
  if (h > 0) return `${h}h ${m % 60}m`
  if (m > 0) return `${m}m ${s % 60}s`
  return `${s}s`
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
}

export default function Home() {
  const { data: stats } = useApi('/stats', { refreshInterval: 10000 })
  const { data: botInfo } = useApi('/bot/info', { refreshInterval: 30000 })
  const { data: guilds } = useApi('/bot/guilds', { refreshInterval: 60000 })
  const { t } = useI18n()
  const [openFaq, setOpenFaq] = useState(null)
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    { icon: HiShieldCheck, key: 'moderation', color: 'text-red-400', bg: 'bg-red-500/10' },
    { icon: HiMusicNote, key: 'music', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: RiTrophyLine, key: 'leveling', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { icon: RiGamepadLine, key: 'economy', color: 'text-green-400', bg: 'bg-green-500/10' },
    { icon: HiTicket, key: 'tickets', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: RiMicLine, key: 'tempvoice', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { icon: HiChat, key: 'welcome', color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { icon: HiStar, key: 'giveaways', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { icon: RiRobotLine, key: 'ai', color: 'text-violet-400', bg: 'bg-violet-500/10', soon: true },
  ]

  const whyReasons = [
    { icon: HiLightningBolt, key: 'allinone', color: 'text-purple-400' },
    { icon: HiChartBar, key: 'modern', color: 'text-cyan-400' },
    { icon: RiPaletteLine, key: 'dashboard', color: 'text-pink-400' },
    { icon: HiHeart, key: 'free', color: 'text-red-400' },
    { icon: RiHeadphoneLine, key: 'support', color: 'text-green-400' },
    { icon: HiLockClosed, key: 'customizable', color: 'text-amber-400' },
  ]

  const faqs = [
    { q: t('faq_q1'), a: t('faq_a1') },
    { q: t('faq_q2'), a: t('faq_a2') },
    { q: t('faq_q3'), a: t('faq_a3') },
    { q: t('faq_q4'), a: t('faq_a4') },
    { q: t('faq_q5'), a: t('faq_a5') },
    { q: t('faq_q6'), a: t('faq_a6') },
  ]

  const interactiveFeatures = [
    {
      icon: HiShieldCheck, title: t('features_moderation'), color: 'from-red-500/20 to-red-900/10',
      items: ['/ban', '/kick', '/timeout', '/warn', '/automod', '/clear', '/lock'],
    },
    {
      icon: HiMusicNote, title: t('features_music'), color: 'from-purple-500/20 to-purple-900/10',
      items: ['/play', '/skip', '/queue', '/filter', '/lyrics', '/volume', '/loop'],
    },
    {
      icon: HiChat, title: t('features_welcome'), color: 'from-pink-500/20 to-pink-900/10',
      items: ['/setup welcome', '/setup goodbye', '/verify button', '/verify rules', '/selfroles'],
    },
  ]

  const socialLinks = [
    { icon: 'discord', href: botInfo?.links?.support || '#', label: 'Discord' },
    { icon: 'github', href: botInfo?.links?.github || '#', label: 'GitHub' },
    { icon: 'topgg', href: botInfo?.links?.topgg || '#', label: 'Top.gg' },
  ]

  return (
    <>
      <Navbar botInfo={botInfo} />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section id="hero" className="relative pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2.5 anime-card rounded-full px-5 py-2.5 mb-8"
            style={{ animation: 'glow-border 3s ease-in-out infinite' }}
          >
            <RiSparklingLine size={14} className="text-primary-light" />
            <span className="text-sm text-primary-light font-medium">{t('hero_badge')}</span>
          </motion.div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white mb-6 tracking-tight leading-[0.95]">
            {t('hero_title_1')}{' '}
            <span className="bg-linear-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent glow-text">
              {t('hero_title_2')}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            {t('hero_subtitle')}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={botInfo?.links?.invite || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="neon-btn bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-2xl
                         transition-all shadow-xl shadow-primary/30 flex items-center gap-2 text-lg"
            >
              {t('hero_cta_add')}
              <HiArrowRight size={20} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={botInfo?.links?.support || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="anime-card text-white font-semibold px-8 py-4 rounded-2xl
                         backdrop-blur-xl flex items-center gap-2 text-lg"
            >
              {t('hero_cta_support')}
              <MessageSquare size={20} />
            </motion.a>
          </div>

          {/* Status line */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>
              {stats ? `${t('hero_online')} — ${t('hero_serving', { count: stats.guilds?.toLocaleString() || '0' })}` : 'Connecting...'}
            </span>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ BOT PROFILE CARD ═══════════════════ */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: 'spring', bounce: 0.3 }}
        >
          <TiltCard maxTilt={10} className="group" sparkle>
            <div className="anime-card rounded-3xl p-8 relative overflow-hidden">
              {/* Neon glow background */}
              <div className="absolute -top-20 -left-20 w-60 h-60 bg-primary/20 rounded-full blur-[80px] pointer-events-none"
                   style={{ animation: 'neon-pulse 4s ease-in-out infinite' }} />
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-cyan-500/15 rounded-full blur-[80px] pointer-events-none"
                   style={{ animation: 'neon-pulse 4s ease-in-out infinite 2s' }} />

              <div className="relative z-10">
                {/* Stats badge (top-left) */}
                <div className="absolute -top-2 -left-2">
                  <div className="flex items-center gap-2 anime-card rounded-full px-3 py-1.5">
                    <Server size={12} className="text-primary-light" />
                    <span className="text-xs font-bold text-white">{stats?.guilds?.toLocaleString() || '—'}</span>
                    <span className="text-xs text-gray-500">{t('stats_servers')}</span>
                  </div>
                </div>

                {/* Avatar with glowing ring */}
                <div className="flex justify-center mt-6 mb-5">
                  <div className="avatar-ring">
                    <div className="relative">
                      <img
                        src="/astra-avatar.png"
                        alt="Astra"
                        className="w-28 h-28 rounded-full object-cover"
                      />
                      {/* Online indicator */}
                      <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-400 rounded-full border-[3px] border-dark-card" />
                    </div>
                  </div>
                </div>

                {/* Name & tag */}
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-extrabold text-white glow-text">
                    {botInfo?.name || 'Astra'}
                  </h3>
                  <p className="text-gray-500 text-sm">@{botInfo?.tag || 'Astra#0'}</p>
                </div>

                {/* Description */}
                <p className="text-center text-gray-400 text-sm leading-relaxed mb-5 max-w-xs mx-auto">
                  {t('hero_subtitle')}
                </p>

                {/* Feature badges */}
                <div className="flex items-center justify-center gap-2 mb-5">
                  {[
                    { icon: HiShieldCheck, color: 'text-red-400', bg: 'bg-red-500/10' },
                    { icon: HiMusicNote, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { icon: RiTrophyLine, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                  ].map((badge, i) => (
                    <div key={i} className={`w-9 h-9 rounded-full ${badge.bg} flex items-center justify-center`}>
                      <badge.icon size={16} className={badge.color} />
                    </div>
                  ))}
                </div>

                {/* Social links */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center
                                 transition-all hover:scale-110 group/social"
                      title={link.label}
                    >
                      {link.icon === 'discord' && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 group-hover/social:text-[#5865F2] transition-colors">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                        </svg>
                      )}
                      {link.icon === 'github' && <SiGithub size={18} className="text-gray-400 group-hover/social:text-white transition-colors" />}
                      {link.icon === 'topgg' && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 group-hover/social:text-[#FF3366] transition-colors">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                      )}
                    </a>
                  ))}
                </div>

                {/* Action links */}
                <div className="space-y-2.5">
                  <a
                    href={botInfo?.links?.invite || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 anime-card rounded-xl px-5 py-3.5 group/link hover:border-primary/40"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <RiRobotLine size={16} className="text-primary-light" />
                    </div>
                    <span className="text-white text-sm font-medium flex-1">{t('hero_cta_add')}</span>
                    <HiArrowRight size={14} className="text-gray-500 group-hover/link:text-primary-light group-hover/link:translate-x-1 transition-all" />
                  </a>

                  <a
                    href={botInfo?.links?.support || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 anime-card rounded-xl px-5 py-3.5 group/link hover:border-primary/40"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#5865F2]/10 flex items-center justify-center">
                      <HiChat size={16} className="text-[#5865F2]" />
                    </div>
                    <span className="text-white text-sm font-medium flex-1">{t('hero_cta_support')}</span>
                    <HiArrowRight size={14} className="text-gray-500 group-hover/link:text-primary-light group-hover/link:translate-x-1 transition-all" />
                  </a>

                  <a
                    href="/dashboard"
                    className="flex items-center gap-3 anime-card rounded-xl px-5 py-3.5 group/link hover:border-primary/40"
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <HiDesktopComputer size={16} className="text-cyan-400" />
                    </div>
                    <span className="text-white text-sm font-medium flex-1">Dashboard</span>
                    <HiArrowRight size={14} className="text-gray-500 group-hover/link:text-primary-light group-hover/link:translate-x-1 transition-all" />
                  </a>
                </div>

                {/* This week stats badge (bottom-right floating) */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-4 -right-4"
                >
                  <div className="anime-card rounded-2xl px-4 py-2.5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <BarChart3 size={14} className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">+{stats?.guilds || 0}</p>
                      <p className="text-gray-500 text-[10px]">{t('stats_servers')}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </section>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: HiServer, label: t('stats_servers'), value: stats?.guilds },
            { icon: HiUsers, label: t('stats_users'), value: stats?.users },
            { icon: HiTerminal, label: t('stats_commands'), value: stats?.commandsUsed },
            { icon: HiClock, label: t('stats_uptime'), value: stats ? formatUptime(stats.uptime) : null },
          ].map((s, i) => (
            <TiltCard key={s.label} className="group" maxTilt={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className="anime-card rounded-2xl p-6 text-center"
              >
                <s.icon size={20} className="text-primary-light mx-auto mb-3 opacity-60" />
                <p className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {typeof s.value === 'number' ? s.value.toLocaleString() : s.value || '—'}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ═══════════════════ BOT SHOWCASE ═══════════════════ */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 glow-text">{t('showcase_title')}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">{t('showcase_subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: HiShieldCheck, key: 'moderation', glow: 'rgba(239, 68, 68, 0.15)' },
            { icon: HiMusicNote, key: 'music', glow: 'rgba(124, 58, 237, 0.15)' },
            { icon: HiDesktopComputer, key: 'dashboard', glow: 'rgba(6, 182, 212, 0.15)' },
          ].map((card, i) => (
            <TiltCard key={card.key} className="group" maxTilt={12}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className="relative anime-card rounded-2xl p-8 h-full overflow-hidden"
                style={{ '--card-glow': card.glow }}
              >
                {/* Neon glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                     style={{ boxShadow: `inset 0 0 60px ${card.glow}` }} />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors"
                       style={{ boxShadow: `0 0 20px ${card.glow}` }}>
                    <card.icon size={28} className="text-primary-light" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{t(`showcase_card_${card.key}`)}</h3>
                  <p className="text-gray-400 leading-relaxed">{t(`showcase_card_${card.key}_desc`)}</p>
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-2">
            {t('features_title')}{' '}
            <span className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {t('features_title_highlight')}
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mt-4">{t('features_subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <TiltCard key={f.key} className="group" maxTilt={10}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
                className="relative anime-card rounded-2xl p-6 h-full"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center shrink-0`}>
                    <f.icon size={22} className={f.color} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-semibold">{t(`features_${f.key}`)}</h3>
                      {f.soon && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {t('features_coming_soon')}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{t(`features_${f.key}_desc`)}</p>
                  </div>
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ═══════════════════ WHY ASTRA ═══════════════════ */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 glow-text">{t('why_title')}</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">{t('why_subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyReasons.map((r, i) => (
            <TiltCard key={r.key} className="group" maxTilt={10}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * i, duration: 0.5 }}
                className="anime-card rounded-2xl p-7 h-full"
              >
                <r.icon size={24} className={`${r.color} mb-4`} />
                <h3 className="text-white font-bold text-lg mb-2">{t(`why_${r.key}`)}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t(`why_${r.key}_desc`)}</p>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ═══════════════════ SERVER SHOWCASE ═══════════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">{t('servers_title')}</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">{t('servers_subtitle')}</p>
          </motion.div>
        </div>

        {guilds && guilds.length > 0 && (
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-dark to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-dark to-transparent z-10 pointer-events-none" />
            <div className="flex gap-6 w-max" style={{ animation: 'slide-left 30s linear infinite' }}>
              {[...guilds, ...guilds].map((guild, i) => (
                <div key={`${guild.id}-${i}`} className="w-72 shrink-0 anime-card rounded-2xl p-5">
                  <div className="flex items-center gap-4">
                    {guild.icon ? (
                      <img src={guild.icon} alt="" className="w-12 h-12 rounded-xl" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-bold">{guild.name?.[0]}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-white font-semibold truncate">{guild.name}</p>
                      <p className="text-gray-500 text-xs">
                        {t('servers_members', { count: guild.memberCount?.toLocaleString() || '0' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════ LIVE STATS ═══════════════════ */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="max-w-4xl mx-auto">
          <div className="anime-card rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"
                 style={{ animation: 'neon-pulse 5s ease-in-out infinite' }} />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"
                 style={{ animation: 'neon-pulse 5s ease-in-out infinite 2.5s' }} />
            <div className="relative z-10">
              <HiGlobe size={32} className="text-primary-light mx-auto mb-4 opacity-60" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 glow-text">
                {stats?.guilds?.toLocaleString() || '—'} {t('stats_servers')}
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                {stats?.users?.toLocaleString() || '—'} {t('stats_users')}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                {[
                  { label: t('stats_servers'), value: stats?.guilds },
                  { label: t('stats_users'), value: stats?.users },
                  { label: t('stats_commands'), value: stats?.commandsUsed },
                  { label: 'Ping', value: stats ? `${Math.max(0, stats.ping || 0)}ms` : null },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-2xl font-bold text-white">
                      {typeof s.value === 'number' ? s.value.toLocaleString() : s.value || '—'}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ DASHBOARD SHOWCASE ═══════════════════ */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">{t('dash_showcase_title')}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">{t('dash_showcase_subtitle')}</p>
        </motion.div>

        <motion.div {...fadeUp} className="relative">
          {/* Ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[50%] bg-primary/6 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative flex items-end justify-center gap-0">
            {/* Desktop Browser Window */}
            <TiltCard className="group w-full max-w-4xl" maxTilt={4} glareColor="rgba(124, 58, 237, 0.08)">
              <div className="anime-card rounded-2xl overflow-hidden shadow-2xl shadow-black/50 energy-card">
                {/* Browser chrome */}
                <div className="flex items-center gap-3 px-5 py-3 border-b border-white/6">
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/70" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <span className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-2 bg-dark-surface/80 rounded-lg px-4 py-1.5 max-w-xs w-full">
                      <HiLockClosed size={10} className="text-green-400/60" />
                      <span className="text-gray-500 text-xs font-mono truncate">astra-bot.app/dashboard</span>
                    </div>
                  </div>
                  <div className="w-16" />
                </div>
                {/* Placeholder content — simulated dashboard UI */}
                <div className="bg-dark-surface p-6 min-h-[320px]">
                  {/* Sidebar + Main area */}
                  <div className="flex gap-5 h-full">
                    {/* Sidebar skeleton */}
                    <div className="hidden sm:flex flex-col gap-3 w-40 shrink-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-primary/20" />
                        <div className="h-3 w-16 rounded bg-white/8" />
                      </div>
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-8 rounded-lg ${i === 1 ? 'bg-primary/15 border border-primary/20' : 'bg-white/4'}`} />
                      ))}
                      <div className="mt-auto h-8 rounded-lg bg-white/4" />
                    </div>
                    {/* Main content skeleton */}
                    <div className="flex-1 space-y-4">
                      {/* Stats row */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                          { label: 'Servers', val: '33', color: 'text-primary-light' },
                          { label: 'Users', val: '4.6K', color: 'text-cyan-400' },
                          { label: 'Commands', val: '86', color: 'text-pink-400' },
                          { label: 'Uptime', val: '15m', color: 'text-green-400' },
                        ].map(s => (
                          <div key={s.label} className="bg-dark-card/80 rounded-xl p-3 border border-white/5">
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider">{s.label}</p>
                            <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
                          </div>
                        ))}
                      </div>
                      {/* Chart placeholder */}
                      <div className="bg-dark-card/80 rounded-xl p-4 border border-white/5">
                        <div className="flex items-center gap-2 mb-3">
                          <BarChart3 size={14} className="text-primary-light" />
                          <span className="text-white text-xs font-medium">Activity Overview</span>
                        </div>
                        <div className="flex items-end gap-1.5 h-24">
                          {[35,55,40,70,50,80,65,90,45,60,75,85].map((h, i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-t bg-linear-to-t from-primary/40 to-primary/10"
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                      </div>
                      {/* Server list placeholder */}
                      <div className="bg-dark-card/80 rounded-xl p-4 border border-white/5 space-y-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10" />
                            <div className="flex-1">
                              <div className="h-2.5 w-24 rounded bg-white/10 mb-1" />
                              <div className="h-2 w-16 rounded bg-white/5" />
                            </div>
                            <div className="h-5 w-14 rounded-full bg-green-500/15 flex items-center justify-center">
                              <span className="text-green-400 text-[9px] font-medium">Active</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* Phone Mockup — overlapping right side */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
              className="hidden md:block absolute -right-4 lg:right-8 bottom-0 z-20 w-48 lg:w-56"
            >
              <TiltCard maxTilt={8} className="group" glareColor="rgba(6, 182, 212, 0.1)">
                <div className="anime-card rounded-3xl p-2 shadow-2xl shadow-black/60"
                     style={{ borderColor: 'rgba(124, 58, 237, 0.25)' }}>
                  {/* Notch */}
                  <div className="relative">
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-4 bg-dark-card rounded-full z-10" />
                  </div>
                  {/* Screen */}
                  <div className="rounded-2xl overflow-hidden bg-dark-surface p-3 space-y-3 min-h-[280px]">
                    {/* Mobile header */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20" />
                      <div className="h-2.5 w-14 rounded bg-white/10" />
                      <div className="ml-auto w-5 h-5 rounded bg-white/5" />
                    </div>
                    {/* Mobile stats */}
                    <div className="grid grid-cols-2 gap-2">
                      {['33', '4.6K', '86', '15m'].map((v, i) => (
                        <div key={i} className="bg-dark-card/80 rounded-lg p-2 border border-white/5 text-center">
                          <p className="text-white text-xs font-bold">{v}</p>
                          <div className="h-1.5 w-8 mx-auto mt-1 rounded bg-white/5" />
                        </div>
                      ))}
                    </div>
                    {/* Mobile chart */}
                    <div className="bg-dark-card/80 rounded-lg p-2 border border-white/5">
                      <div className="flex items-end gap-1 h-12">
                        {[40,60,35,75,50,85,65].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t bg-linear-to-t from-cyan-500/40 to-cyan-500/10"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>
                    {/* Mobile list */}
                    {[1,2].map(i => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/10" />
                        <div className="flex-1">
                          <div className="h-2 w-16 rounded bg-white/8" />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Home indicator */}
                  <div className="flex justify-center py-1.5">
                    <div className="w-16 h-1 rounded-full bg-white/15" />
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </div>

          {/* Device badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            {[
              { icon: HiDesktopComputer, label: 'Desktop' },
              { icon: RiTabletLine, label: 'Tablet' },
              { icon: HiDeviceMobile, label: 'Mobile' },
            ].map((device) => (
              <div key={device.label} className="flex items-center gap-2 anime-card rounded-full px-4 py-2">
                <device.icon size={14} className="text-primary-light" />
                <span className="text-xs text-gray-400 font-medium">{device.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ INTERACTIVE FEATURES ═══════════════════ */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">{t('interactive_title')}</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">{t('interactive_subtitle')}</p>
        </motion.div>

        <motion.div {...fadeUp}>
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {interactiveFeatures.map((feat, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFeature(i)}
                  className={`flex items-center gap-3 px-5 py-4 rounded-xl text-left transition-all whitespace-nowrap
                             bg-transparent border-none cursor-pointer shrink-0
                    ${activeFeature === i
                      ? 'bg-primary/10 text-white shadow-lg shadow-primary/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  style={activeFeature === i ? { border: '1px solid rgba(124, 58, 237, 0.3)' } : {}}
                >
                  <feat.icon size={20} />
                  <span className="font-medium text-sm">{feat.title}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`anime-card rounded-2xl p-8 bg-linear-to-br ${interactiveFeatures[activeFeature].color}`}
              >
                <h3 className="text-xl font-bold text-white mb-6">{interactiveFeatures[activeFeature].title}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {interactiveFeatures[activeFeature].items.map((cmd) => (
                    <div
                      key={cmd}
                      className="bg-dark-surface/50 border border-white/4 rounded-xl px-4 py-3 text-sm text-gray-300 font-mono
                                 hover:border-primary/30 hover:text-white hover:shadow-lg hover:shadow-primary/5 transition-all"
                    >
                      {cmd}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ FAQ ═══════════════════ */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">{t('faq_title')}</h2>
          <p className="text-gray-400 text-lg">{t('faq_subtitle')}</p>
        </motion.div>

        <motion.div {...fadeUp} className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="anime-card rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left
                           bg-transparent border-none cursor-pointer"
              >
                <span className="text-white font-medium pr-4">{faq.q}</span>
                <HiChevronDown
                  size={18}
                  className={`text-gray-500 shrink-0 transition-transform duration-300
                    ${openFaq === i ? 'rotate-180 text-primary' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-gray-400 leading-relaxed">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div {...fadeUp}>
          <div className="anime-card rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute -top-20 left-1/4 w-60 h-60 bg-primary/15 rounded-full blur-[100px] pointer-events-none"
                 style={{ animation: 'neon-pulse 4s ease-in-out infinite' }} />
            <div className="absolute -bottom-20 right-1/4 w-60 h-60 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"
                 style={{ animation: 'neon-pulse 4s ease-in-out infinite 2s' }} />
            <div className="relative z-10">
              <img src="/astra-avatar.png" alt="Astra" className="w-16 h-16 rounded-full mx-auto mb-6 avatar-ring" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 glow-text">{t('cta_title')}</h2>
              <p className="text-gray-400 max-w-lg mx-auto mb-8 text-lg">{t('cta_subtitle')}</p>
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href={botInfo?.links?.invite || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="neon-btn inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold
                           px-10 py-4 rounded-2xl transition-all shadow-xl shadow-primary/30 text-lg"
              >
                {t('cta_button')}
                <HiArrowRight size={20} />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer botInfo={botInfo} />
    </>
  )
}
