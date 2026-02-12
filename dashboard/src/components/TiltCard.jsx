import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function TiltCard({
  children,
  className = '',
  glare = true,
  maxTilt = 15,
  scale = 1.02,
  glareColor = 'rgba(124, 58, 237, 0.12)',
  edgeGlow = true,
  sparkle = false,
}) {
  const ref = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [sparkles, setSparkles] = useState([])

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const springConfig = { stiffness: 260, damping: 24, mass: 0.8 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  const rotateX = useTransform(smoothY, [0, 1], [maxTilt, -maxTilt])
  const rotateY = useTransform(smoothX, [0, 1], [-maxTilt, maxTilt])

  const glareX = useTransform(smoothX, [0, 1], [0, 100])
  const glareY = useTransform(smoothY, [0, 1], [0, 100])
  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, ${glareColor} 0%, transparent 55%)`
  )

  const edgeGlowX = useTransform(smoothX, [0, 0.5, 1], [1, 0, 1])
  const edgeGlowY = useTransform(smoothY, [0, 0.5, 1], [1, 0, 1])
  const edgeOpacity = useTransform(
    [edgeGlowX, edgeGlowY],
    ([x, y]) => Math.max(x, y) * 0.6
  )

  const spawnSparkle = useCallback(() => {
    if (!sparkle || !isHovered) return
    const id = Date.now() + Math.random()
    const x = Math.random() * 100
    const y = Math.random() * 100
    const size = Math.random() * 3 + 1.5
    const duration = Math.random() * 800 + 600
    setSparkles(prev => [...prev.slice(-6), { id, x, y, size, duration }])
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== id))
    }, duration)
  }, [sparkle, isHovered])

  useEffect(() => {
    if (!sparkle || !isHovered) return
    const interval = setInterval(spawnSparkle, 300)
    return () => clearInterval(interval)
  }, [sparkle, isHovered, spawnSparkle])

  function handleMouseMove(e) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    mouseX.set(x)
    mouseY.set(y)
  }

  function handleMouseEnter() {
    setIsHovered(true)
  }

  function handleMouseLeave() {
    setIsHovered(false)
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative ${className}`}
    >
      {children}

      {/* Glare follow layer */}
      {glare && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
          style={{
            opacity: isHovered ? 1 : 0,
            background: glareBackground,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* Edge glow */}
      {edgeGlow && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
          style={{
            opacity: edgeOpacity,
            boxShadow: `inset 0 0 40px rgba(124, 58, 237, 0.08), 0 0 20px rgba(124, 58, 237, 0.06)`,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* Sparkle particles */}
      {sparkle && sparkles.map(s => (
        <span
          key={s.id}
          className="pointer-events-none absolute z-20"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: 'white',
            boxShadow: `0 0 ${s.size * 3}px rgba(124, 58, 237, 0.8), 0 0 ${s.size * 6}px rgba(124, 58, 237, 0.4)`,
            animation: `sparkle-fade ${s.duration}ms ease-out forwards`,
          }}
        />
      ))}
    </motion.div>
  )
}
