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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white/95 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-900/95">
      <div className="flex items-center justify-around px-2 py-3">
        <button
          onClick={() => onViewChange("chat")}
          className={cls(
            "flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors",
            currentView === "chat"
              ? "text-blue-600 dark:text-blue-400"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
          )}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs font-medium">Chats</span>
        </button>

        <button
          onClick={onOpenCharacters}
          className={cls(
            "flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors",
            currentView === "characters"
              ? "text-blue-600 dark:text-blue-400"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
          )}
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-xs font-medium">Characters</span>
        </button>

        <button
          onClick={onOpenSidebar}
          className="flex flex-col items-center gap-1 rounded-lg px-4 py-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <Menu className="h-5 w-5" />
          <span className="text-xs font-medium">Menu</span>
        </button>
      </div>
    </div>
  )
}
