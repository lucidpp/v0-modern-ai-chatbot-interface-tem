"use client"
import { ExternalLink } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface LinkBubbleProps {
  url: string
  displayText: string
}

export default function LinkBubble({ url, displayText }: LinkBubbleProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  function handleClick() {
    setShowConfirm(true)
  }

  function handleConfirm() {
    window.open(url, "_blank", "noopener,noreferrer")
    setShowConfirm(false)
  }

  return (
    <span className="relative inline-block">
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 transition-all hover:bg-blue-200 hover:shadow-sm dark:bg-blue-950/50 dark:text-blue-400 dark:hover:bg-blue-900/50"
      >
        <ExternalLink className="h-3 w-3" />
        {displayText}
      </button>

      <AnimatePresence>
        {showConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="fixed inset-0 z-50 bg-black/20"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute left-0 top-full z-50 mt-2 w-64 rounded-lg border border-zinc-200 bg-white p-3 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="mb-2 text-xs text-zinc-600 dark:text-zinc-400">Open external link?</p>
              <p className="mb-3 truncate rounded bg-zinc-100 px-2 py-1 text-xs font-mono text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                {url}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleConfirm}
                  className="flex-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-blue-700"
                >
                  Open
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </span>
  )
}
