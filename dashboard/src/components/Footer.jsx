import { HiExternalLink, HiHeart } from 'react-icons/hi'
import { SiDiscord, SiGithub } from 'react-icons/si'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n.js'

export default function Footer({ botInfo }) {
  const { t } = useI18n()

  const columns = [
    {
      title: t('footer_product'),
      links: [
        { label: t('nav_features'), href: '/#features' },
        { label: t('nav_commands'), href: '/commands' },
        { label: t('footer_add_bot'), href: botInfo?.links?.invite || '#', external: true },
      ],
    },
    {
      title: t('footer_resources'),
      links: [
        { label: t('footer_documentation'), href: botInfo?.links?.docs || '#' },
        { label: t('footer_support_server'), href: botInfo?.links?.support || '#', external: true },
        { label: t('footer_github'), href: botInfo?.links?.github || '#', external: true },
      ],
    },
    {
      title: t('footer_legal'),
      links: [
        { label: t('footer_privacy'), href: '/privacy' },
        { label: t('footer_terms'), href: '/terms' },
        { label: t('footer_status'), href: '/status' },
      ],
    },
  ]

  const socialLinks = [
    { icon: SiDiscord, href: botInfo?.links?.support || '#', label: 'Discord' },
    { icon: SiGithub, href: botInfo?.links?.github || '#', label: 'GitHub' },
  ]

  return (
    <footer className="border-t border-primary/10 mt-20 relative">
      <div className="absolute inset-0 bg-linear-to-t from-primary/2 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/astra-avatar.png" alt="Astra" className="w-8 h-8 rounded-full ring-2 ring-primary/20" />
              <span className="text-white font-bold text-lg glow-text">{botInfo?.name || 'Astra'}</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">{t('footer_description')}</p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mb-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-primary/15 flex items-center justify-center
                             text-gray-500 hover:text-primary-light transition-all"
                  aria-label={label}
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
            <p className="text-gray-600 text-xs">v{botInfo?.version || '2.0.0'}</p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-1.5 group"
                      >
                        {link.label}
                        <HiExternalLink className="text-[10px] opacity-0 group-hover:opacity-50 transition-opacity" />
                      </a>
                    ) : (
                      <Link to={link.href} className="text-gray-500 hover:text-white text-sm transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} {botInfo?.name || 'Astra'}. {t('footer_rights')}
          </p>
          <div className="flex items-center gap-1.5 text-gray-600 text-sm">
            <span>{t('footer_made_with')}</span>
            <HiHeart className="text-red-500 text-xs" />
            <span>{t('footer_by')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
