'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const message =
  'Chúc em xinh đẹp, trưởng thành hơn'

const replacementText = 'Mãi yêu em'

export default function TypewriterMessage() {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [phase, setPhase] = useState<'typing' | 'fading' | 'replaced'>('typing')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const fadingTimer = useRef<ReturnType<typeof setTimeout>>()
  const replacedTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true)
      setIsTyping(true)
    }
  }, [isInView, hasStarted])

  useEffect(() => {
    if (!isTyping) return

    let index = 0
    const interval = setInterval(() => {
      if (index < message.length) {
        setDisplayedText(message.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
        setIsTyping(false)
        fadingTimer.current = setTimeout(() => setPhase('fading'), 3000)
        replacedTimer.current = setTimeout(() => setPhase('replaced'), 4000)
      }
    }, 60)

    return () => clearInterval(interval)
  }, [isTyping])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(fadingTimer.current)
      clearTimeout(replacedTimer.current)
    }
  }, [])

  return (
    <motion.div
      ref={ref}
      className="mb-16 px-2"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center mb-6">
        <span className="text-3xl">💌</span>
      </div>

      <AnimatePresence mode="wait">
        {phase !== 'replaced' ? (
          <motion.div
            key="original"
            animate={{
              opacity: phase === 'fading' ? 0 : 1,
              x: phase === 'fading' ? 30 : 0,
              filter: phase === 'fading' ? 'blur(4px)' : 'blur(0px)',
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <p
              className="font-serif text-lg text-rose-800/80 leading-relaxed text-center italic whitespace-pre-line"
            >
              &ldquo;{displayedText}&rdquo;
              {isTyping && <span className="typewriter-cursor" />}
            </p>
          </motion.div>
        ) : (
          <motion.p
            key="replacement"
            className="font-serif text-lg text-rose-600/90 leading-relaxed text-center italic"
            initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            &ldquo;{replacementText}&rdquo;
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
