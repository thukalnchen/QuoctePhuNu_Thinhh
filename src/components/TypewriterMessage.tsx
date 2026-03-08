'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const message =
  'chúc em 3 đừng, 3 không, 3 nhớ\n\nđừng quá khắt khe với bản thân\nđừng hoài nghi chính mình và đừng từ chối tui  :>>\n\nkhông buồn nhiều quá, không áp lực quá và không một mình gánh cả thế giới nữa\n\nnhớ giữ sức khỏe, nhớ cười nhiều hơn và nhớ là có một người đáng yêu luôn chờ em'

const replacementText = 'Nhưng giờ nó không dành cho em nữa rồi'

export default function TypewriterMessage() {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [phase, setPhase] = useState<'typing' | 'showing' | 'strikethrough' | 'fading' | 'replaced'>('typing')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

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
        setIsTyping(false)
        setPhase('showing')
        clearInterval(interval)
      }
    }, 60)

    return () => clearInterval(interval)
  }, [isTyping])

  // After 20s of showing the full message, start strikethrough
  useEffect(() => {
    if (phase !== 'showing') return

    const t1 = setTimeout(() => setPhase('strikethrough'), 0)
    const t2 = setTimeout(() => setPhase('fading'), 3000)
    const t3 = setTimeout(() => setPhase('replaced'), 4000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [phase])

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
              className="font-serif text-lg text-rose-800/80 leading-relaxed text-center italic whitespace-pre-line transition-all duration-700"
              style={{
                textDecoration: phase === 'strikethrough' || phase === 'fading' ? 'line-through' : 'none',
                textDecorationColor: 'rgba(244, 114, 182, 0.8)',
                textDecorationThickness: '2px',
              }}
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
