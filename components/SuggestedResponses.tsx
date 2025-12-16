"use client"

import { Lightbulb } from "lucide-react"
import { cls } from "./utils"

interface SuggestedResponsesProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
  className?: string
}

export default function SuggestedResponses({ suggestions, onSelect, className }: SuggestedResponsesProps) {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className={cls("space-y-2", className)}>
      <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
        <Lightbulb className="h-3.5 w-3.5" />
        Suggested responses
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(suggestion)}
            className="animate-in fade-in slide-in-from-bottom-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
