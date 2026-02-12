import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiChevronDoubleUp } from 'react-icons/hi'

export default function ScrollWidgets() {
  const [progress, setProgress] = useState(0)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
      setShowTop(scrollTop > 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const circumference = 2 * Math.PI * 18
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <>
      {/* Scroll progress bar — top of viewport */}
      <div className="fixed top-0 left-0 right-0 z-100 h-[2px] pointer-events-none">
        <motion.div
          className="h-full bg-linear-to-r from-primary via-cyan-400 to-primary"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.05 }}
        />
        {/* Glow effect */}
        <div
          className="absolute top-0 h-[3px] blur-sm bg-linear-to-r from-primary via-cyan-400 to-primary opacity-60"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full
                       bg-transparent border-none cursor-pointer
                       flex items-center justify-center group"
            aria-label="Scroll to top"
          >
            {/* Circular progress ring */}
            <svg className="absolute inset-0 w-12 h-12 -rotate-90" viewBox="0 0 40 40">
              <circle
                cx="20" cy="20" r="18"
                fill="rgba(8, 8, 26, 0.8)"
                stroke="rgba(124, 58, 237, 0.15)"
                strokeWidth="2"
              />
              <circle
                cx="20" cy="20" r="18"
                fill="none"
                stroke="url(#progressGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-100"
              />
              <defs>
                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
            </svg>

            {/* Arrow icon */}
            <HiChevronDoubleUp className="relative z-10 text-lg text-primary-light group-hover:text-white
                                          transition-colors group-hover:-translate-y-0.5 duration-200" />

            {/* Hover glow */}
            <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100
                            blur-md transition-opacity duration-300 pointer-events-none" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
