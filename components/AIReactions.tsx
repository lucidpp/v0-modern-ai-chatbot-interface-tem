"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

const reactions = [
  { id: "thinking", emoji: "🤔", label: "Thinking..." },
  { id: "processing", emoji: "⚡", label: "Processing..." },
  { id: "analyzing", emoji: "🔍", label: "Analyzing..." },
  { id: "understanding", emoji: "💡", label: "I see..." },
  { id: "excited", emoji: "✨", label: "Interesting!" },
  { id: "calculating", emoji: "🧮", label: "Calculating..." },
]

interface AIReactionsProps {
  isThinking?: boolean
}

export default function AIReactions({ isThinking = false }: AIReactionsProps) {
  const [currentReaction, setCurrentReaction] = useState(reactions[0])

  useEffect(() => {
    if (!isThinking) return

    const interval = setInterval(() => {
      setCurrentReaction((prev) => {
        const currentIndex = reactions.findIndex((r) => r.id === prev.id)
        const nextIndex = (currentIndex + 1) % reactions.length
        return reactions[nextIndex]
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isThinking])

  if (!isThinking) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentReaction.id}
        initial={{ opacity: 0, y: 5, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -5, scale: 0.8 }}
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400"
      >
        <motion.span
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          className="text-base"
        >
          {currentReaction.emoji}
        </motion.span>
        <span>{currentReaction.label}</span>
      </motion.div>
    </AnimatePresence>
  )
}
