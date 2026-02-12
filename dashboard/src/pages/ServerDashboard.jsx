import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiArrowLeft, HiCog, HiShieldCheck, HiChartBar, HiChat, HiMusicNote,
  HiUsers, HiHashtag, HiExclamation, HiSave, HiCheck, HiBell
} from 'react-icons/hi'
import { CgSpinner } from 'react-icons/cg'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { useAuth } from '../hooks/useAuth.js'

const TABS = [
  { id: 'overview', label: 'Overview', icon: HiChartBar },
  { id: 'settings', label: 'Settings', icon: HiCog },
  { id: 'moderation', label: 'Moderation', icon: HiShieldCheck },
  { id: 'automod', label: 'AutoMod', icon: HiExclamation },
  { id: 'welcome', label: 'Welcome', icon: HiChat },
  { id: 'music', label: 'Music', icon: HiMusicNote },
]

const CHART_COLORS = ['#7C3AED', '#06B6D4', '#F59E0B', '#EF4444', '#10B981', '#EC4899', '#8B5CF6', '#14B8A6']

export default function ServerDashboard() {
  const { guildId } = useParams()
  const { user } = useAuth()
  const [tab, setTab] = useState('overview')
  const [guild, setGuild] = useState(null)
  const [stats, setStats] = useState(null)
  const [automod, setAutomod] = useState(null)
  const [warnings, setWarnings] = useState([])
  const [modlog, setModlog] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const fetchGuild = useCallback(async () => {
    try {
      const res = await fetch(`/api/guild/${guildId}`, { credentials: 'include' })
      if (!res.ok) return
      const data = await res.json()
      setGuild(data)
      setSettings(data.settings || {})
    } catch { /* ignore */ }
    setLoading(false)
  }, [guildId])

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/guild/${guildId}/stats`, { credentials: 'include' })
      if (res.ok) setStats(await res.json())
    } catch { /* ignore */ }
  }, [guildId])

  const fetchAutomod = useCallback(async () => {
    try {
      const res = await fetch(`/api/guild/${guildId}/automod`, { credentials: 'include' })
      if (res.ok) setAutomod(await res.json())
    } catch { /* ignore */ }
  }, [guildId])

  const fetchWarnings = useCallback(async () => {
    try {
      const res = await fetch(`/api/guild/${guildId}/warnings`, { credentials: 'include' })
      if (res.ok) setWarnings(await res.json())
    } catch { /* ignore */ }
  }, [guildId])

  const fetchModlog = useCallback(async () => {
    try {
      const res = await fetch(`/api/guild/${guildId}/modlog`, { credentials: 'include' })
      if (res.ok) setModlog(await res.json())
    } catch { /* ignore */ }
  }, [guildId])

  useEffect(() => {
    const load = async () => {
      await fetchGuild()
      fetchStats()
      fetchAutomod()
      fetchWarnings()
      fetchModlog()
    }
    load()
  }, [fetchGuild, fetchStats, fetchAutomod, fetchWarnings, fetchModlog])

  async function saveSettings(data, endpoint = 'settings') {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch(`/api/guild/${guildId}/${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
        if (endpoint === 'settings') fetchGuild()
        if (endpoint === 'automod') fetchAutomod()
      }
    } catch { /* ignore */ }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CgSpinner size={32} className="text-primary animate-spin" />
      </div>
    )
  }

  if (!guild) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <HiExclamation size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">You don't have access to this server or the bot isn't present.</p>
          <Link to="/dashboard" className="text-primary hover:text-primary-light transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const textChannels = guild.channels?.filter(c => c.type === 0) || []
  const roles = guild.roles || []

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-dark-card border-r border-white/6
                         flex flex-col z-40 transition-transform duration-300
                         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Server info */}
        <div className="p-5 border-b border-white/6">
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-4 transition-colors">
            <HiArrowLeft size={14} /> Back
          </Link>
          <div className="flex items-center gap-3">
            {guild.icon ? (
              <img src={guild.icon} alt="" className="w-10 h-10 rounded-xl" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">{guild.name?.[0]}</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{guild.name}</p>
              <p className="text-gray-500 text-xs">{guild.memberCount?.toLocaleString()} members</p>
            </div>
          </div>
        </div>

        {/* Nav tabs */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                         transition-all bg-transparent border-none cursor-pointer text-left
                ${tab === t.id ? 'bg-primary/10 text-primary-light' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <t.icon size={18} />
              {t.label}
            </button>
          ))}
        </nav>

        {/* User */}
        {user && (
          <div className="p-4 border-t border-white/6 flex items-center gap-3">
            <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.globalName || user.username}</p>
              <p className="text-gray-600 text-xs truncate">@{user.username}</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 p-6 sm:p-8">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden mb-4 text-gray-400 hover:text-white bg-dark-card border border-white/6
                     rounded-xl px-4 py-2 text-sm cursor-pointer"
        >
          Menu
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'overview' && <OverviewTab stats={stats} guild={guild} />}
            {tab === 'settings' && (
              <SettingsTab
                settings={settings}
                setSettings={setSettings}
                channels={textChannels}
                roles={roles}
                onSave={() => saveSettings(settings)}
                saving={saving}
                saved={saved}
              />
            )}
            {tab === 'moderation' && <ModerationTab warnings={warnings} modlog={modlog} />}
            {tab === 'automod' && (
              <AutomodTab
                automod={automod}
                setAutomod={setAutomod}
                onSave={(data) => saveSettings(data, 'automod')}
                saving={saving}
                saved={saved}
              />
            )}
            {tab === 'welcome' && (
              <WelcomeTab
                settings={settings}
                setSettings={setSettings}
                channels={textChannels}
                roles={roles}
                onSave={() => saveSettings(settings)}
                saving={saving}
                saved={saved}
              />
            )}
            {tab === 'music' && <MusicTab settings={settings} guild={guild} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

/* ═══════════════════ SAVE BUTTON ═══════════════════ */
function SaveButton({ onSave, saving, saved }) {
  return (
    <button
      onClick={onSave}
      disabled={saving}
      className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium
                 px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 border-none cursor-pointer"
    >
      {saving ? <CgSpinner size={16} className="animate-spin" /> : saved ? <HiCheck size={16} /> : <HiSave size={16} />}
      {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
    </button>
  )
}

/* ═══════════════════ SELECT COMPONENT ═══════════════════ */
function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value || null)}
        className="w-full bg-dark-surface border border-white/6 rounded-xl px-4 py-2.5 text-white text-sm
                   focus:outline-none focus:border-primary/30 transition-colors appearance-none cursor-pointer"
      >
        <option value="">{placeholder || 'None'}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

/* ═══════════════════ TOGGLE COMPONENT ═══════════════════ */
function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {description && <p className="text-gray-500 text-xs mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors border-none cursor-pointer
          ${checked ? 'bg-primary' : 'bg-white/10'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform
          ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}

/* ═══════════════════ OVERVIEW TAB ═══════════════════ */
function OverviewTab({ stats }) {
  if (!stats) return <div className="text-gray-500">Loading statistics...</div>

  const statCards = [
    { label: 'Members', value: stats.memberCount, icon: HiUsers, color: 'text-blue-400' },
    { label: 'Channels', value: stats.channelCount, icon: HiHashtag, color: 'text-cyan-400' },
    { label: 'Commands Used', value: stats.totalCommands, icon: HiChartBar, color: 'text-purple-400' },
    { label: 'Warnings', value: stats.totalWarnings, icon: HiExclamation, color: 'text-yellow-400' },
    { label: 'Mod Actions', value: stats.totalModActions, icon: HiShieldCheck, color: 'text-red-400' },
    { label: 'Roles', value: stats.roleCount, icon: HiBell, color: 'text-green-400' },
  ]

  const cmdData = Object.entries(stats.commandBreakdown || {})
    .map(([name, count]) => ({ name: `/${name}`, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  const pieData = cmdData.slice(0, 6)

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Server Overview</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map(s => (
          <div key={s.label} className="bg-dark-card border border-white/6 rounded-2xl p-5">
            <s.icon size={18} className={`${s.color} mb-2 opacity-60`} />
            <p className="text-2xl font-bold text-white">{(s.value || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Command usage bar chart */}
        {cmdData.length > 0 && (
          <div className="bg-dark-card border border-white/6 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Top Commands</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={cmdData}>
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0a0a14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#a78bfa' }}
                />
                <Bar dataKey="count" fill="#7C3AED" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Command distribution pie */}
        {pieData.length > 0 && (
          <div className="bg-dark-card border border-white/6 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Command Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0a0a14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                  {d.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent commands */}
      {stats.recentCommands?.length > 0 && (
        <div className="bg-dark-card border border-white/6 rounded-2xl p-6 mt-6">
          <h3 className="text-white font-semibold mb-4">Recent Commands</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {stats.recentCommands.map((cmd, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/4 last:border-0">
                <span className="text-sm text-gray-300 font-mono">/{cmd.command}</span>
                <span className="text-xs text-gray-500">{new Date(cmd.usedAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════ SETTINGS TAB ═══════════════════ */
function SettingsTab({ settings, setSettings, channels, roles, onSave, saving, saved }) {
  const channelOpts = channels.map(c => ({ value: c.id, label: `#${c.name}` }))
  const roleOpts = roles.map(r => ({ value: r.id, label: r.name }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Server Settings</h2>
        <SaveButton onSave={onSave} saving={saving} saved={saved} />
      </div>

      <div className="space-y-6">
        <div className="bg-dark-card border border-white/6 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Logging Channels</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Log Channel" value={settings.logChannel} onChange={v => setSettings(s => ({ ...s, logChannel: v }))} options={channelOpts} placeholder="Select channel..." />
            <SelectField label="Mod Log Channel" value={settings.modLogChannel} onChange={v => setSettings(s => ({ ...s, modLogChannel: v }))} options={channelOpts} placeholder="Select channel..." />
          </div>
        </div>

        <div className="bg-dark-card border border-white/6 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Roles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Mute Role" value={settings.muteRole} onChange={v => setSettings(s => ({ ...s, muteRole: v }))} options={roleOpts} placeholder="Select role..." />
            <SelectField label="DJ Role" value={settings.djRole} onChange={v => setSettings(s => ({ ...s, djRole: v }))} options={roleOpts} placeholder="Select role..." />
            <SelectField label="Verify Role" value={settings.verifyRole} onChange={v => setSettings(s => ({ ...s, verifyRole: v }))} options={roleOpts} placeholder="Select role..." />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════ MODERATION TAB ═══════════════════ */
function ModerationTab({ warnings, modlog }) {
  const [view, setView] = useState('modlog')

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Moderation</h2>

      <div className="flex gap-2 mb-6">
        {['modlog', 'warnings'].map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors bg-transparent border-none cursor-pointer
              ${view === v ? 'bg-primary/10 text-primary-light' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            {v === 'modlog' ? `Mod Log (${modlog.length})` : `Warnings (${warnings.length})`}
          </button>
        ))}
      </div>

      <div className="bg-dark-card border border-white/6 rounded-2xl overflow-hidden">
        {view === 'modlog' && (
          <div className="divide-y divide-white/4">
            {modlog.length === 0 && <p className="p-6 text-gray-500 text-sm">No mod actions yet.</p>}
            {modlog.map((a, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full
                    ${a.action === 'ban' ? 'bg-red-500/10 text-red-400' :
                      a.action === 'kick' ? 'bg-orange-500/10 text-orange-400' :
                      a.action === 'timeout' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-blue-500/10 text-blue-400'}`}>
                    {a.action}
                  </span>
                  <span className="text-gray-300 text-sm ml-3">{a.reason || 'No reason'}</span>
                </div>
                <span className="text-gray-600 text-xs">{new Date(a.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
        {view === 'warnings' && (
          <div className="divide-y divide-white/4">
            {warnings.length === 0 && <p className="p-6 text-gray-500 text-sm">No warnings yet.</p>}
            {warnings.map((w, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300 text-sm">User: <code className="text-primary-light">{w.userId}</code></span>
                  <span className="text-gray-600 text-xs">{new Date(w.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-500 text-sm">{w.reason || 'No reason'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════ AUTOMOD TAB ═══════════════════ */
function AutomodTab({ automod, setAutomod, onSave, saving, saved }) {
  if (!automod) return <div className="text-gray-500">Loading...</div>

  const update = (key, val) => setAutomod(prev => ({ ...prev, [key]: val }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">AutoMod Settings</h2>
        <SaveButton onSave={() => onSave(automod)} saving={saving} saved={saved} />
      </div>

      <div className="space-y-4">
        <div className="bg-dark-card border border-white/6 rounded-2xl p-6">
          <Toggle label="Enable AutoMod" description="Master switch for all automod features" checked={automod.enabled || false} onChange={v => update('enabled', v)} />
        </div>

        <div className="bg-dark-card border border-white/6 rounded-2xl p-6 space-y-1">
          <h3 className="text-white font-semibold mb-2">Filters</h3>
          <Toggle label="Anti-Spam" description="Detect and remove spam messages" checked={automod.antiSpam || false} onChange={v => update('antiSpam', v)} />
          <Toggle label="Anti-Link" description="Remove messages containing links" checked={automod.antiLink || false} onChange={v => update('antiLink', v)} />
          <Toggle label="Anti-Invite" description="Remove Discord invite links" checked={automod.antiInvite || false} onChange={v => update('antiInvite', v)} />
          <Toggle label="Bad Words Filter" description="Filter profanity and custom bad words" checked={automod.badWords || false} onChange={v => update('badWords', v)} />
          <Toggle label="Caps Filter" description="Limit excessive use of capital letters" checked={automod.capsFilter || false} onChange={v => update('capsFilter', v)} />
          <Toggle label="Emoji Filter" description="Limit excessive emoji usage" checked={automod.emojiFilter || false} onChange={v => update('emojiFilter', v)} />
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════ WELCOME TAB ═══════════════════ */
function WelcomeTab({ settings, setSettings, channels, roles, onSave, saving, saved }) {
  const channelOpts = channels.map(c => ({ value: c.id, label: `#${c.name}` }))
  const roleOpts = roles.map(r => ({ value: r.id, label: r.name }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Welcome & Verification</h2>
        <SaveButton onSave={onSave} saving={saving} saved={saved} />
      </div>

      <div className="space-y-6">
        <div className="bg-dark-card border border-white/6 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Welcome System</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Welcome Channel" value={settings.welcomeChannel} onChange={v => setSettings(s => ({ ...s, welcomeChannel: v }))} options={channelOpts} placeholder="Select channel..." />
            <SelectField label="Goodbye Channel" value={settings.goodbyeChannel} onChange={v => setSettings(s => ({ ...s, goodbyeChannel: v }))} options={channelOpts} placeholder="Select channel..." />
          </div>
        </div>

        <div className="bg-dark-card border border-white/6 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Verification</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Verify Channel" value={settings.verifyChannel} onChange={v => setSettings(s => ({ ...s, verifyChannel: v }))} options={channelOpts} placeholder="Select channel..." />
            <SelectField label="Verify Role" value={settings.verifyRole} onChange={v => setSettings(s => ({ ...s, verifyRole: v }))} options={roleOpts} placeholder="Select role..." />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════ MUSIC TAB ═══════════════════ */
function MusicTab({ settings, guild }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Music Settings</h2>

      <div className="bg-dark-card border border-white/6 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Current Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-400 text-sm">DJ Role</span>
            <span className="text-white text-sm">
              {settings.djRole ? guild.roles?.find(r => r.id === settings.djRole)?.name || 'Unknown' : 'Not set'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-400 text-sm">Supported Sources</span>
            <span className="text-white text-sm">YouTube, Spotify, SoundCloud, Apple Music</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-400 text-sm">Audio Filters</span>
            <span className="text-white text-sm">20+ filters available</span>
          </div>
        </div>
      </div>

      <div className="bg-dark-card border border-white/6 rounded-2xl p-6 mt-4">
        <h3 className="text-white font-semibold mb-2">Music Commands</h3>
        <p className="text-gray-500 text-sm mb-4">Available music commands in your server:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {['/play', '/stop', '/skip', '/pause', '/queue', '/nowplaying', '/volume', '/loop', '/shuffle', '/filter', '/lyrics', '/dj', '/remove', '/move'].map(cmd => (
            <div key={cmd} className="bg-dark-surface border border-white/4 rounded-xl px-3 py-2 text-sm text-gray-300 font-mono">
              {cmd}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
