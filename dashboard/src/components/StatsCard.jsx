import { motion } from 'framer-motion'

export default function StatsCard({ icon: Icon, label, value, suffix = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-dark-card border border-white/8 rounded-2xl p-6 backdrop-blur-xl
                 hover:bg-dark-card-hover hover:border-primary/30 hover:-translate-y-1
                 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-default"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="text-primary-light" size={24} />
        </div>
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white mt-0.5">
            {value !== null && value !== undefined ? (
              <>
                {typeof value === 'number' ? value.toLocaleString() : value}
                {suffix && <span className="text-sm text-gray-500 ml-1">{suffix}</span>}
              </>
            ) : (
              <span className="inline-block w-16 h-6 bg-white/5 rounded animate-pulse" />
            )}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
