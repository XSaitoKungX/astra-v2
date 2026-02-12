import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineMenuAlt3, HiX, HiExternalLink, HiChevronDown, HiLogin, HiLogout } from 'react-icons/hi'
import { RiDashboardLine, RiGlobalLine, RiSparklingLine } from 'react-icons/ri'
import { SiDiscord } from 'react-icons/si'
import { useI18n } from '../i18n/useI18n.js'
import { useAuth } from '../hooks/useAuth.js'

const langLabels = { en: '🇺🇸 EN', de: '🇩🇪 DE' }

const dropdownMotion = {
  initial: { opacity: 0, y: 8, scale: 0.96, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, y: 4, scale: 0.97, filter: 'blur(4px)' },
  transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] },
}

export default function Navbar({ botInfo }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [langPos, setLangPos] = useState(null)
  const [userPos, setUserPos] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const { t, lang, switchLang, locales } = useI18n()
  const { user, login, logout } = useAuth()
  const langBtnRef = useRef(null)
  const userBtnRef = useRef(null)
  const langDropRef = useRef(null)
  const userDropRef = useRef(null)

  // Navbar background on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function toggleLang() {
    setUserMenuOpen(false)
    if (!langOpen && langBtnRef.current) {
      const r = langBtnRef.current.getBoundingClientRect()
      setLangPos({ top: r.bottom + 8, right: window.innerWidth - r.right })
    }
    setLangOpen(v => !v)
  }

  function toggleUser() {
    setLangOpen(false)
    if (!userMenuOpen && userBtnRef.current) {
      const r = userBtnRef.current.getBoundingClientRect()
      setUserPos({ top: r.bottom + 8, right: window.innerWidth - r.right })
    }
    setUserMenuOpen(v => !v)
  }

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (langOpen && langBtnRef.current && !langBtnRef.current.contains(e.target) && langDropRef.current && !langDropRef.current.contains(e.target)) setLangOpen(false)
      if (userMenuOpen && userBtnRef.current && !userBtnRef.current.contains(e.target) && userDropRef.current && !userDropRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [langOpen, userMenuOpen])

  const navLinks = [
    { label: t('nav_home'), href: '/', scroll: 'hero' },
    { label: t('nav_features'), href: '/', scroll: 'features' },
    { label: t('nav_commands'), href: '/commands' },
    { label: t('nav_support'), href: botInfo?.links?.support || '#', external: true },
  ]

  function handleNavClick(e, link) {
    if (link.scroll) {
      e.preventDefault()
      const el = document.getElementById(link.scroll)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`mt-4 px-6 py-3 flex items-center justify-between rounded-2xl transition-all duration-300
                          ${scrolled ? 'navbar-anime shadow-xl shadow-black/30' : 'navbar-anime'}`}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img src="/astra-avatar.png" alt="Astra" className="w-8 h-8 rounded-full ring-2 ring-primary/30 group-hover:ring-primary/60 transition-all" />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-dark" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight group-hover:text-primary-light transition-colors">
                {botInfo?.name || 'Astra'}
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-all text-sm px-3 py-2 rounded-lg hover:bg-white/5 flex items-center gap-1.5"
                  >
                    {link.label}
                    <HiExternalLink className="text-[11px] opacity-50" />
                  </a>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className="text-gray-400 hover:text-white transition-all text-sm px-3 py-2 rounded-lg hover:bg-white/5"
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>

            {/* Right side: lang switcher + auth + CTA */}
            <div className="hidden md:flex items-center gap-2">
              {/* Language Switcher */}
              <div>
                <button
                  ref={langBtnRef}
                  onClick={toggleLang}
                  className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm px-3 py-2 rounded-lg
                             hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer"
                >
                  <RiGlobalLine className="text-sm" />
                  <span>{langLabels[lang]}</span>
                  <HiChevronDown className={`text-[10px] transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* User / Auth */}
              {user ? (
                <div>
                  <button
                    ref={userBtnRef}
                    onClick={toggleUser}
                    className="flex items-center gap-2 bg-transparent border-none cursor-pointer px-2 py-1.5 rounded-xl
                               hover:bg-white/5 transition-all"
                  >
                    <img src={user.avatar} alt="" className="w-7 h-7 rounded-full ring-2 ring-primary/30" />
                    <span className="text-white text-sm font-medium max-w-[100px] truncate">{user.globalName || user.username}</span>
                    <HiChevronDown className={`text-[10px] text-gray-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={login}
                  className="flex items-center gap-2 text-gray-400 hover:text-white text-sm px-3 py-2 rounded-lg
                             hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer"
                >
                  <HiLogin className="text-sm" /> Login
                </button>
              )}

              <a
                href={botInfo?.links?.invite || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="neon-btn flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium px-5 py-2 rounded-xl
                           transition-all hover:shadow-lg hover:shadow-primary/25"
              >
                <SiDiscord className="text-sm" />
                {t('nav_add_bot')}
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-gray-400 hover:text-white bg-transparent border-none cursor-pointer p-1"
            >
              {mobileOpen ? <HiX className="text-xl" /> : <HiOutlineMenuAlt3 className="text-xl" />}
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 p-4 md:hidden anime-card rounded-2xl"
              >
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    onClick={(e) => handleNavClick(e, link)}
                    className="flex items-center justify-between py-2.5 px-3 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  >
                    {link.label}
                    {link.external && <HiExternalLink className="text-xs opacity-40" />}
                  </a>
                ))}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                  {locales.map((l) => (
                    <button
                      key={l}
                      onClick={() => switchLang(l)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors bg-transparent border-none cursor-pointer
                        ${l === lang ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-white'}`}
                    >
                      {langLabels[l]}
                    </button>
                  ))}
                </div>
                {user ? (
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-3 px-3">
                    <img src={user.avatar} alt="" className="w-8 h-8 rounded-full ring-2 ring-primary/20" />
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate">{user.globalName || user.username}</p>
                    </div>
                    <button onClick={logout} className="text-red-400 hover:text-red-300 bg-transparent border-none cursor-pointer p-1">
                      <HiLogout className="text-lg" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={login}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 text-sm text-white bg-primary/20 hover:bg-primary/30
                               rounded-lg transition-colors border-none cursor-pointer"
                  >
                    <SiDiscord /> Login with Discord
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Fixed-position dropdowns — outside navbar to avoid backdrop-filter containing block */}
      <AnimatePresence>
        {langOpen && langPos && (
          <motion.div
            ref={langDropRef}
            {...dropdownMotion}
            className="fixed w-36 rounded-xl overflow-hidden shadow-2xl shadow-black/60 p-1.5"
            style={{ top: langPos.top, right: langPos.right, zIndex: 9999, background: 'var(--color-dark-card)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => { switchLang(l); setLangOpen(false) }}
                className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all bg-transparent border-none cursor-pointer flex items-center gap-2.5
                  ${l === lang
                    ? 'text-primary-light bg-primary/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <span className="text-base">{l === 'en' ? '🇺🇸' : '🇩🇪'}</span>
                <span>{l === 'en' ? 'English' : 'Deutsch'}</span>
                {l === lang && <RiSparklingLine className="ml-auto text-primary-light text-xs" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {userMenuOpen && userPos && (
          <motion.div
            ref={userDropRef}
            {...dropdownMotion}
            className="fixed w-56 rounded-xl overflow-hidden shadow-2xl shadow-black/60"
            style={{ top: userPos.top, right: userPos.right, zIndex: 9999, background: 'var(--color-dark-card)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {/* User info header */}
            <div className="px-4 py-3 border-b border-white/6">
              <div className="flex items-center gap-3">
                <img src={user?.avatar} alt="" className="w-10 h-10 rounded-full ring-2 ring-primary/20" />
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{user?.globalName || user?.username}</p>
                  <p className="text-gray-500 text-xs truncate">@{user?.username}</p>
                </div>
              </div>
            </div>
            {/* Menu items */}
            <div className="p-1.5">
              <Link
                to="/dashboard"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white
                           hover:bg-white/5 transition-all rounded-lg"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <RiDashboardLine className="text-primary-light text-sm" />
                </div>
                {t('nav_dashboard')}
              </Link>
              <div className="my-1 mx-3 border-t border-white/5" />
              <button
                onClick={() => { setUserMenuOpen(false); logout() }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300
                           hover:bg-red-500/5 transition-all bg-transparent border-none cursor-pointer text-left rounded-lg"
              >
                <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <HiLogout className="text-sm" />
                </div>
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
