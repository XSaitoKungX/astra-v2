import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiServer, HiUsers, HiExternalLink, HiLogin, HiSearch, HiArrowRight,
  HiLightningBolt, HiCog
} from 'react-icons/hi'
import { RiSparklingLine, RiVipCrownLine } from 'react-icons/ri'
import { useAuth } from '../hooks/useAuth.js'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import TiltCard from '../components/TiltCard.jsx'
import { useApi } from '../hooks/useApi.js'

const FILTERS = [
  { id: 'all', label: 'All Servers' },
  { id: 'active', label: 'With Bot' },
  { id: 'inactive', label: 'Without Bot' },
]

export default function Dashboard() {
  const { user, loading, login } = useAuth()
  const { data: botInfo } = useApi('/bot/info', { refreshInterval: 30000 })
  const [guilds, setGuilds] = useState([])
  const [guildsLoading, setGuildsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!user) return
    fetch('/api/auth/guilds', { credentials: 'include' })
      .then(r => r.json())
      .then(data => { setGuilds(Array.isArray(data) ? data : []); setGuildsLoading(false) })
      .catch(() => setGuildsLoading(false))
  }, [user])

  const filtered = guilds
    .filter(g => g.name.toLowerCase().includes(search.toLowerCase()))
    .filter(g => filter === 'all' ? true : filter === 'active' ? g.botPresent : !g.botPresent)

  const activeCount = guilds.filter(g => g.botPresent).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <Navbar botInfo={botInfo} />
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <TiltCard maxTilt={6} className="group">
              <div className="anime-card rounded-3xl p-10 text-center max-w-md w-full relative overflow-hidden">
                {/* Glow orbs */}
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/15 rounded-full blur-[60px] pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6
                                  ring-1 ring-primary/20">
                    <HiLogin size={32} className="text-primary-light" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-3 glow-text">Sign in to Dashboard</h1>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    Log in with your Discord account to manage your servers and configure Astra.
                  </p>
                  <button
                    onClick={login}
                    className="w-full neon-btn bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-3.5 px-6 rounded-xl
                               transition-all flex items-center justify-center gap-2.5 border-none cursor-pointer
                               shadow-lg shadow-[#5865F2]/20 hover:shadow-xl hover:shadow-[#5865F2]/30"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                    </svg>
                    Continue with Discord
                  </button>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar botInfo={botInfo} />
      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">

        {/* ═══ User Header Banner ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="anime-card rounded-2xl p-6 relative overflow-hidden">
            {/* Banner glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-cyan-500/8 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={user.avatar}
                alt=""
                className="w-16 h-16 rounded-2xl ring-2 ring-primary/20 shadow-lg shadow-primary/10"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-white truncate">
                    {user.globalName || user.username}
                  </h1>
                  <RiSparklingLine size={16} className="text-primary-light shrink-0" />
                </div>
                <p className="text-gray-500 text-sm">@{user.username}</p>
              </div>
              {/* Quick stats */}
              <div className="flex gap-4 sm:gap-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{guilds.length}</p>
                  <p className="text-gray-500 text-xs">Servers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-primary-light">{activeCount}</p>
                  <p className="text-gray-500 text-xs">With Bot</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ Search + Filter Bar ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <div className="relative flex-1">
            <HiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search servers..."
              className="w-full anime-card rounded-xl pl-11 pr-4 py-3 text-white text-sm
                         placeholder-gray-500 focus:outline-none focus:border-primary/30 transition-colors"
            />
          </div>
          <div className="flex gap-1.5 p-1 anime-card rounded-xl">
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all border-none cursor-pointer
                  ${filter === f.id
                    ? 'bg-primary/15 text-primary-light'
                    : 'bg-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ═══ Server Grid ═══ */}
        {guildsLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Loading servers...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((guild, i) => (
                <motion.div
                  key={guild.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * i, duration: 0.3 }}
                >
                  <div className={`anime-card rounded-2xl p-5 h-full transition-all duration-300 group
                    ${guild.botPresent ? '' : 'opacity-50 hover:opacity-70'}`}>
                    <div className="flex items-center gap-4 mb-4">
                      {guild.icon ? (
                        <img
                          src={guild.icon}
                          alt=""
                          className="w-12 h-12 rounded-xl ring-1 ring-white/10 group-hover:ring-primary/20 transition-all"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center
                                        ring-1 ring-primary/20">
                          <span className="text-primary-light font-bold text-lg">{guild.name?.[0]}</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-semibold truncate text-sm">{guild.name}</p>
                          {guild.owner && <RiVipCrownLine size={13} className="text-yellow-500 shrink-0" />}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          {guild.memberCount && (
                            <p className="text-gray-500 text-xs flex items-center gap-1">
                              <HiUsers size={11} /> {guild.memberCount.toLocaleString()}
                            </p>
                          )}
                          {guild.botPresent && (
                            <span className="flex items-center gap-1 text-xs text-green-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {guild.botPresent ? (
                      <Link
                        to={`/dashboard/${guild.id}`}
                        className="flex items-center justify-center gap-2 w-full bg-primary/10 hover:bg-primary/20
                                   text-primary-light font-medium py-2.5 rounded-xl text-sm transition-all
                                   group-hover:shadow-lg group-hover:shadow-primary/5"
                      >
                        <HiCog size={14} />
                        Manage Server
                        <HiArrowRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      </Link>
                    ) : (
                      <a
                        href={`https://discord.com/oauth2/authorize?client_id=${botInfo?.id}&permissions=8&scope=bot%20applications.commands&guild_id=${guild.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10
                                   text-gray-400 hover:text-gray-300 font-medium py-2.5 rounded-xl text-sm transition-all"
                      >
                        <HiLightningBolt size={14} />
                        Add Bot
                        <HiExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ═══ Empty State ═══ */}
        {!guildsLoading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="anime-card rounded-2xl p-12 max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <HiServer size={28} className="text-gray-500" />
              </div>
              <p className="text-gray-400 font-medium mb-1">No servers found</p>
              <p className="text-gray-600 text-sm">
                {search ? 'Try a different search term.' : 'You don\'t have any servers yet.'}
              </p>
            </div>
          </motion.div>
        )}
      </div>
      <Footer botInfo={botInfo} />
    </>
  )
}
