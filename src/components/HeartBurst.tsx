'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'

interface HeartParticle {
  id: number
  x: number
  y: number
  scale: number
  rotation: number
  color: string
}

const colors = ['#ff6b81', '#ff4757', '#e84393', '#fd79a8', '#f8a5c2', '#ff6348', '#ff7979']

export default function HeartBurst() {
  const [hearts, setHearts] = useState<HeartParticle[]>([])
  const [clickCount, setClickCount] = useState(0)

  const triggerBurst = useCallback(() => {
    if (clickCount >= 3) return // No more clicks after 3rd

    const newHearts: HeartParticle[] = Array.from({ length: 18 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 250,
      y: -(Math.random() * 200 + 50),
      scale: Math.random() * 0.8 + 0.4,
      rotation: (Math.random() - 0.5) * 120,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    setHearts(prev => [...prev, ...newHearts])
    setClickCount(prev => prev + 1)

    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(n => n.id === h.id)))
    }, 2000)
  }, [clickCount])

  return (
    <div className="flex flex-col items-center relative mb-8">
      {/* Heart particles */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <AnimatePresence>
          {hearts.map(heart => (
            <motion.div
              key={heart.id}
              className="absolute left-1/2 bottom-1/2"
              initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
              animate={{
                x: heart.x,
                y: heart.y,
                opacity: 0,
                scale: heart.scale,
                rotate: heart.rotation,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              <Heart
                size={20}
                fill={heart.color}
                color={heart.color}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Button */}
      <motion.button
        className="relative px-8 py-4 rounded-full font-serif text-lg text-white shadow-xl animate-pulse-glow"
        style={{
          background: 'linear-gradient(135deg, #ff6b81 0%, #e84393 50%, #fd79a8 100%)',
        }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={triggerBurst}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="flex items-center gap-2">
          <Heart size={18} className="fill-white" />
          Chạm vào anhhh
          <Heart size={18} className="fill-white" />
        </span>
      </motion.button>

      {/* Click response messages */}
      <AnimatePresence>
        {clickCount >= 1 && (
          <motion.div
            key={`response-${clickCount}`}
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main message */}
            <motion.p
              className="text-sm text-rose-500/70 font-serif italic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {clickCount === 1 && '💕 Em là tất cả của anh...'}
              {clickCount === 2 && '💕 Yêu em nhiều '}
              {clickCount >= 3 && '💕 Thích chạm thế cơ à !'}
              {clickCount >= 4 && '💕 Thích chạm thế cơ à !'}
            </motion.p>

            {/* Floating "chạm lần nữa đi" hint - only for click 1 and 2 */}
            {clickCount < 3 && (
              <motion.p
                className="mt-3 text-xs text-rose-400/50 font-serif tracking-wider"
                initial={{ opacity: 0, y: 15 }}
                animate={{
                  opacity: [0, 1, 1, 0.7],
                  y: [15, 0, -3, -5],
                }}
                transition={{
                  duration: 2.5,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                ✧ chạm lần nữa đi ✧
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
