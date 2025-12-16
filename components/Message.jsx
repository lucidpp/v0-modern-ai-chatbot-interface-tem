"use client"

import { Volume2, RotateCcw, Heart, Smile, ThumbsUp, Sparkles } from "lucide-react"
import { cls } from "./utils"
import { getUserInitials } from "@/lib/auth"
import { useState } from "react"
import { renderTextWithLinks } from "@/lib/link-detector"
import LinkBubble from "./LinkBubble"
import { motion, AnimatePresence } from "framer-motion"

const quickReactions = [
  { id: "like", icon: ThumbsUp, label: "Like" },
  { id: "love", icon: Heart, label: "Love" },
  { id: "spark", icon: Sparkles, label: "Brilliant" },
  { id: "smile", icon: Smile, label: "Smile" },
]

export default function Message({ role, children, userName, onRetry, messageId }) {
  const isUser = role === "user"
  const initials = isUser && userName ? getUserInitials(userName) : isUser ? "U" : "AI"
  const [isPlaying, setIsPlaying] = useState(false)
  const [liked, setLiked] = useState(false)
  const [selectedReaction, setSelectedReaction] = useState(null)
  const [showReactions, setShowReactions] = useState(false)

  function handlePlayAudio() {
    if ("speechSynthesis" in window) {
      const text = typeof children === "string" ? children : children?.props?.children || ""
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  function handleStopAudio() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    }
  }

  function handleLike() {
    setLiked(!liked)
  }

  function handleReaction(reactionId) {
    if (selectedReaction === reactionId) {
      setSelectedReaction(null)
    } else {
      setSelectedReaction(reactionId)
    }
    setShowReactions(false)
  }

  const content = typeof children === "string" ? children : children?.props?.children || ""
  const parsedContent = typeof content === "string" ? renderTextWithLinks(content) : [{ type: "text", content }]

  return (
    <div className={cls("flex gap-3 transition-all hover:scale-[1.01]", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-xs font-bold text-white shadow-md transition-transform hover:scale-110">
          AI
        </div>
      )}
      <div className="relative">
        <div
          className={cls(
            "max-w-[80%] rounded-lg px-4 py-3 text-sm shadow-md transition-all",
            isUser
              ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:scale-[1.02]"
              : "bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 hover:shadow-lg hover:scale-[1.02]",
          )}
        >
          <div className="whitespace-pre-wrap">
            {parsedContent.map((part, idx) =>
              part.type === "link" ? (
                <LinkBubble key={idx} url={part.url || ""} displayText={part.content} />
              ) : (
                <span key={idx}>{part.content}</span>
              ),
            )}
          </div>

          {!isUser && (
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={isPlaying ? handleStopAudio : handlePlayAudio}
                className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-all hover:scale-105 hover:bg-zinc-200 hover:shadow-md dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                title={isPlaying ? "Stop playback" : "Play audio"}
              >
                <Volume2 className={cls("h-3.5 w-3.5", isPlaying && "animate-pulse")} />
                {isPlaying ? "Stop" : "Play"}
              </button>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-all hover:scale-105 hover:bg-zinc-200 hover:shadow-md dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  title="Retry generation"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Retry
                </button>
              )}
              <button
                onClick={handleLike}
                className={cls(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all hover:scale-105 hover:shadow-md",
                  liked
                    ? "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700",
                )}
                title="Like message"
              >
                <Heart className={cls("h-3.5 w-3.5", liked && "fill-current")} />
                {liked ? "Liked" : "Like"}
              </button>
              <button
                onClick={() => setShowReactions(!showReactions)}
                className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-all hover:scale-105 hover:bg-zinc-200 hover:shadow-md dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                title="React"
              >
                <Smile className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {showReactions && !isUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className="absolute left-0 top-full z-10 mt-2 flex gap-2 rounded-lg border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
            >
              {quickReactions.map((reaction) => {
                const Icon = reaction.icon
                const isSelected = selectedReaction === reaction.id
                return (
                  <button
                    key={reaction.id}
                    onClick={() => handleReaction(reaction.id)}
                    className={cls(
                      "rounded-md p-2.5 transition-all hover:scale-110",
                      isSelected
                        ? "bg-indigo-100 text-indigo-600 shadow-md dark:bg-indigo-950/50 dark:text-indigo-400"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                    )}
                    title={reaction.label}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {selectedReaction && !isUser && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-2 left-2 rounded-md bg-indigo-100 p-1.5 shadow-md dark:bg-indigo-950/50"
          >
            {(() => {
              const reaction = quickReactions.find((r) => r.id === selectedReaction)
              if (!reaction) return null
              const Icon = reaction.icon
              return <Icon className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
            })()}
          </motion.div>
        )}
      </div>
      {isUser && (
        <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-xs font-bold text-white shadow-md transition-transform hover:scale-110">
          {initials}
        </div>
      )}
    </div>
  )
}
