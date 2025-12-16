"use client"

import { MessageSquare, Sparkles, Menu } from "lucide-react"
import { cls } from "./utils"

interface MobileNavProps {
  onOpenSidebar: () => void
  onOpenCharacters: () => void
  currentView: "chat" | "characters"
  onViewChange: (view: "chat" | "characters") => void
}

export default function MobileNav({ onOpenSidebar, onOpenCharacters, currentView, onViewChange }: MobileNavProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200/60 bg-white/98 backdrop-blur-xl shadow-[0_-4px_16px_rgba(0,0,0,0.08)] dark:border-zinc-800/60 dark:bg-zinc-900/98 dark:shadow-[0_-4px_16px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        <button
          onClick={() => onViewChange("chat")}
          className={cls(
            "flex flex-col items-center gap-1.5 rounded-xl px-6 py-2.5 transition-all active:scale-95",
            currentView === "chat"
              ? "bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 shadow-sm dark:from-indigo-950/40 dark:to-purple-950/40 dark:text-indigo-400"
              : "text-zinc-600 hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:active:bg-zinc-700",
          )}
        >
          <MessageSquare className={cls("h-5 w-5", currentView === "chat" && "scale-110")} />
          <span className="text-xs font-semibold">Chats</span>
        </button>

        <button
          onClick={onOpenCharacters}
          className={cls(
            "flex flex-col items-center gap-1.5 rounded-xl px-6 py-2.5 transition-all active:scale-95",
            currentView === "characters"
              ? "bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 shadow-sm dark:from-indigo-950/40 dark:to-purple-950/40 dark:text-indigo-400"
              : "text-zinc-600 hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:active:bg-zinc-700",
          )}
        >
          <Sparkles className={cls("h-5 w-5", currentView === "characters" && "scale-110")} />
          <span className="text-xs font-semibold">Characters</span>
        </button>

        <button
          onClick={onOpenSidebar}
          className="flex flex-col items-center gap-1.5 rounded-xl px-6 py-2.5 text-zinc-600 transition-all hover:bg-zinc-100 active:scale-95 active:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:active:bg-zinc-700"
        >
          <Menu className="h-5 w-5" />
          <span className="text-xs font-semibold">Menu</span>
        </button>
      </div>
    </div>
  )
}
