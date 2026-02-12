function seeded(i, salt) {
  const x = Math.sin(i * 9301 + salt * 49297) * 49297
  return x - Math.floor(x)
}

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${seeded(i, 1) * 100}%`,
  bottom: `${-(seeded(i, 2) * 20)}%`,
  duration: `${12 + seeded(i, 3) * 18}s`,
  delay: `${seeded(i, 4) * 15}s`,
  size: seeded(i, 5) * 2 + 1,
  color: seeded(i, 6) > 0.5
    ? `rgba(124, 58, 237, ${0.3 + seeded(i, 7) * 0.4})`
    : `rgba(6, 182, 212, ${0.2 + seeded(i, 8) * 0.3})`,
}))

export default function AnimeBackground() {
  return (
    <div className="anime-bg">
      {/* Gradient orbs */}
      <div className="anime-bg-orb anime-bg-orb-1" />
      <div className="anime-bg-orb anime-bg-orb-2" />
      <div className="anime-bg-orb anime-bg-orb-3" />
      <div className="anime-bg-orb anime-bg-orb-4" />

      {/* Floating particles */}
      {PARTICLES.map(p => (
        <div
          key={p.id}
          className="anime-bg-particle"
          style={{
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* Scan lines */}
      <div className="anime-bg-scanline" />

      {/* Grid overlay */}
      <div className="anime-bg-grid" />
    </div>
  )
}
