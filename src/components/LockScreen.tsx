'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Delete } from 'lucide-react'

const CORRECT_PIN = '0405'
const PIN_LENGTH = 4

interface LockScreenProps {
  onUnlock: () => void
  onFirstInteraction?: () => void
}

function Star({ style }: { style: React.CSSProperties }) {
  return <div className="star" style={style} />
}

export default function LockScreen({ onUnlock, onFirstInteraction }: LockScreenProps) {
  const [pin, setPin] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const [isError, setIsError] = useState(false)

  const stars = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      style: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 3 + 2}s`,
      } as React.CSSProperties,
    }))
  }, [])

  const handlePress = useCallback((digit: string) => {
    if (pin.length >= PIN_LENGTH) return

    // Start music on first keypad press
    if (onFirstInteraction) onFirstInteraction()

    const newPin = pin + digit
    setPin(newPin)
    setIsError(false)

    if (newPin.length === PIN_LENGTH) {
      setTimeout(() => {
        if (newPin === CORRECT_PIN) {
          onUnlock()
        } else {
          setIsShaking(true)
          setIsError(true)
          setTimeout(() => {
            setIsShaking(false)
            setPin('')
            setIsError(false)
          }, 600)
        }
      }, 200)
    }
  }, [pin, onUnlock])

  const handleDelete = useCallback(() => {
    setPin(prev => prev.slice(0, -1))
    setIsError(false)
  }, [])

  const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Stars */}
      {stars.map(star => (
        <Star key={star.id} style={star.style} />
      ))}

      {/* Glassmorphism container */}
      <motion.div
        className="glass rounded-3xl p-8 max-w-sm w-full text-center relative z-10"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        {/* Decorative sparkle */}
        <motion.div
          className="text-4xl mb-4"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        >
          🌙
        </motion.div>

        {/* Prompt text */}
        <h1 className="font-serif text-lg text-white/90 leading-relaxed mb-8">
          Một bí mật nhỏ đang đợi em.{' '}
          <span className="text-white/60 text-base italic">
            Nhập mật mã để mở khóa bầu trời này...
          </span>
        </h1>

        {/* PIN dots */}
        <motion.div
          className={`flex justify-center gap-4 mb-10 ${isShaking ? 'animate-shake' : ''}`}
        >
          {Array.from({ length: PIN_LENGTH }, (_, i) => (
            <motion.div
              key={i}
              className={`pin-dot ${i < pin.length ? 'filled' : ''} ${isError ? 'border-red-400' : ''}`}
              animate={i < pin.length ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.2 }}
            />
          ))}
        </motion.div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3">
          {buttons.map((btn, index) => {
            if (btn === '') {
              return <div key={index} />
            }

            if (btn === 'del') {
              return (
                <motion.button
                  key={index}
                  className="glass-button rounded-2xl h-14 flex items-center justify-center text-white/70 hover:text-white/90"
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDelete}
                >
                  <Delete size={20} />
                </motion.button>
              )
            }

            return (
              <motion.button
                key={index}
                className="glass-button rounded-2xl h-14 text-xl font-light text-white/90 hover:text-white"
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePress(btn)}
              >
                {btn}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Bottom hint */}
      <motion.p
        className="text-white/30 text-xs mt-8 font-light tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        ✧ gợi ý: 0405 ✧
      </motion.p>
    </div>
  )
}
