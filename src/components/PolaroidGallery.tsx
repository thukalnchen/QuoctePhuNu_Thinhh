'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const images = [
  { src: '/1.jpg', rotation: 'rotate-2' },
  { src: '/2.jpg', rotation: '-rotate-3' },
  { src: '/3.jpg', rotation: 'rotate-1' },
  { src: '/4.jpg', rotation: '-rotate-2' },
  { src: '/5.jpg', rotation: 'rotate-3' },
  { src: '/6.jpg', rotation: '-rotate-1' },
  { src: '/7.jpg', rotation: 'rotate-2' },
  { src: '/8.jpg', rotation: '-rotate-3' },
  { src: '/9.jpg', rotation: 'rotate-1' },
]

const oldCaptions = [
  '💕 Khoảnh khắc đẹp',
  '🌸 Nụ cười của em',
  '✨ Ánh mắt lấp lánh',
  '🌷 Ngày nắng đẹp',
  '💐 Hoa cho em',
  '🌙 Đêm lung linh',
  '☀️ Sáng trong veo',
  '🦋 Nhẹ nhàng thôi',
  '💫 ',
]



const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.3,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
}

function AnimatedCaption({ oldText }: { oldText: string }) {
  const [phase, setPhase] = useState<'old' | 'strikethrough'>('old')
  const imageRef = useRef<HTMLDivElement>(null)
  const isHalfVisible = useInView(imageRef, { once: true, amount: 0.5 })
  const hasTriggered = useRef(false)

  useEffect(() => {
    if (isHalfVisible && !hasTriggered.current) {
      hasTriggered.current = true
      const t1 = setTimeout(() => setPhase('strikethrough'), 1500)
      return () => clearTimeout(t1)
    }
  }, [isHalfVisible])

  return (
    <div ref={imageRef}>
      <div className="pt-3 pb-1 text-center min-h-[40px] flex items-center justify-center">
        <p className="font-serif text-xs text-gray-400 italic relative">
          <span
            className="transition-all duration-700"
            style={{
              textDecoration: phase === 'strikethrough' ? 'line-through' : 'none',
              textDecorationColor: 'rgba(244, 114, 182, 0.8)',
              textDecorationThickness: '2px',
            }}
          >
            {oldText}
          </span>
        </p>
      </div>
    </div>
  )
}

export default function PolaroidGallery() {
  return (
    <motion.div
      className="flex flex-col gap-8 items-center mb-12"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
    >
      {images.map((img, index) => (
        <motion.div
          key={index}
          className={`polaroid ${img.rotation} w-[85%] max-w-[320px]`}
          variants={item}
        >
          <div className="w-full overflow-hidden">
            <img
              src={img.src}
              alt={`Memory ${index + 1}`}
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
          <AnimatedCaption
            oldText={oldCaptions[index]}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
