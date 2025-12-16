"use client"

import { ChevronDown, Sparkles, Users, MessageSquare } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { MODELS, type ModelType } from "@/lib/routeway-api"
import { cls } from "./utils"

interface ModelSelectorProps {
  selectedModel: ModelType
  onModelChange: (model: ModelType) => void
}

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const current = MODELS.find((m) => m.id === selectedModel) || MODELS[2]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium transition-all hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      >
        <Sparkles className="h-4 w-4 text-blue-500" />
        <span className="hidden sm:inline">{current.name}</span>
        <ChevronDown className={cls("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 animate-in fade-in slide-in-from-top-2 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-2 px-2 py-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">Select Model</div>
          {MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onModelChange(model.id)
                setOpen(false)
              }}
              className={cls(
                "w-full rounded-md px-3 py-2.5 text-left transition-colors",
                selectedModel === model.id
                  ? "bg-blue-50 dark:bg-blue-950/30"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{model.name}</span>
                    {selectedModel === model.id && <span className="text-xs text-blue-600 dark:text-blue-400">✓</span>}
                  </div>
                  <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{model.description}</div>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {model.chatCount} chats
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {model.userCount} users
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
