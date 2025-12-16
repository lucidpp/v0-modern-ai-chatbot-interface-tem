"use client"

import { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react"
import { Pencil, RefreshCw, Check, X, Square, ImageIcon } from "lucide-react"
import Message from "./Message"
import Composer from "./Composer"
import SuggestedResponses from "./SuggestedResponses"
import AIReactions from "./AIReactions"
import { cls, timeAgo } from "./utils"
import { generateSuggestions } from "@/lib/suggestions"

function ThinkingMessage({ onPause, modes }) {
  return (
    <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-xs font-bold text-white shadow-md">
        AI
      </div>
      <div className="max-w-[80%] rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 [animation-delay:-0.3s]"></div>
            <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 [animation-delay:-0.15s]"></div>
            <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>
          </div>
          <AIReactions isThinking={true} />
          <button
            onClick={onPause}
            className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-all hover:scale-105 hover:bg-zinc-50 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            <Square className="h-3 w-3" /> Pause
          </button>
        </div>
        {(modes?.thinking || modes?.search) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {modes.thinking && (
              <span className="inline-flex items-center gap-1 rounded-md bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-950/50 dark:text-purple-400">
                Deep thinking enabled
              </span>
            )}
            {modes.search && (
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                Searching the web
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const ChatPane = forwardRef(function ChatPane(
  { conversation, onSend, onEditMessage, onResendMessage, isThinking, onPauseThinking, userName, thinkingModes },
  ref,
) {
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState("")
  const [busy, setBusy] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [currentModes, setCurrentModes] = useState({ thinking: false, search: false })
  const composerRef = useRef(null)

  useImperativeHandle(
    ref,
    () => ({
      insertTemplate: (templateContent) => {
        composerRef.current?.insertTemplate(templateContent)
      },
    }),
    [],
  )

  useEffect(() => {
    if (!conversation || !conversation.messages) {
      setSuggestions(generateSuggestions(undefined, "user"))
      return
    }

    const messages = Array.isArray(conversation.messages) ? conversation.messages : []
    if (messages.length === 0) {
      setSuggestions(generateSuggestions(undefined, "user"))
    } else {
      const lastMsg = messages[messages.length - 1]
      setSuggestions(generateSuggestions(lastMsg.content, lastMsg.role))
    }
  }, [conversation])

  if (!conversation) return null

  const tags = ["Certified", "Personalized", "Experienced", "Helpful"]
  const messages = Array.isArray(conversation.messages) ? conversation.messages : []
  const count = messages.length || conversation.messageCount || 0

  function startEdit(m) {
    setEditingId(m.id)
    setDraft(m.content)
  }
  function cancelEdit() {
    setEditingId(null)
    setDraft("")
  }
  function saveEdit() {
    if (!editingId) return
    onEditMessage?.(editingId, draft)
    cancelEdit()
  }
  function saveAndResend() {
    if (!editingId) return
    onEditMessage?.(editingId, draft)
    onResendMessage?.(editingId)
    cancelEdit()
  }

  function handleSuggestionSelect(suggestion) {
    composerRef.current?.insertTemplate(suggestion)
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mb-2 text-3xl font-serif tracking-tight sm:text-4xl md:text-5xl animate-in fade-in slide-in-from-top-4">
          <span className="block leading-[1.05] font-sans text-2xl">{conversation.title}</span>
        </div>
        <div className="mb-4 text-sm text-zinc-500 dark:text-zinc-400 animate-in fade-in slide-in-from-top-4">
          Updated {timeAgo(conversation.updatedAt)} · {count} messages
        </div>

        <div className="mb-6 flex flex-wrap gap-2 border-b border-zinc-200 pb-5 dark:border-zinc-800 animate-in fade-in slide-in-from-top-4">
          {tags.map((t, idx) => (
            <span
              key={t}
              className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-all hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 animate-in fade-in slide-in-from-left-2"
              style={{ animationDelay: `${idx * 75}ms` }}
            >
              {t}
            </span>
          ))}
        </div>

        {messages.length === 0 ? (
          <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-4 rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No messages yet. Say hello to start.
          </div>
        ) : (
          <>
            {messages.map((m, idx) => (
              <div
                key={m.id}
                className="space-y-2 animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                {editingId === m.id ? (
                  <div className={cls("rounded-lg border p-2", "border-zinc-200 dark:border-zinc-800")}>
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      className="w-full resize-y rounded-lg bg-transparent p-2 text-sm outline-none"
                      rows={3}
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={saveEdit}
                        className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                      >
                        <Check className="h-3.5 w-3.5" /> Save
                      </button>
                      <button
                        onClick={saveAndResend}
                        className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-medium transition-all hover:scale-105 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Save & Resend
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all hover:scale-105 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Message
                      role={m.role}
                      userName={userName}
                      messageId={m.id}
                      onRetry={m.role === "assistant" ? () => onResendMessage?.(m.id) : undefined}
                    >
                      <div className="whitespace-pre-wrap">{m.content}</div>
                      {m.files && m.files.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {m.files.map((file, idx) => (
                            <div
                              key={idx}
                              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs transition-all hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
                            >
                              <ImageIcon className="h-3 w-3" />
                              <span className="max-w-[120px] truncate">{file.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </Message>
                    {m.role === "user" && (
                      <div className="ml-10 mt-1 flex gap-2 text-[11px] text-zinc-500">
                        <button
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 transition-all hover:scale-105 hover:bg-zinc-100 hover:shadow-sm dark:hover:bg-zinc-800"
                          onClick={() => startEdit(m)}
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 transition-all hover:scale-105 hover:bg-zinc-100 hover:shadow-sm dark:hover:bg-zinc-800"
                          onClick={() => onResendMessage?.(m.id)}
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Resend
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isThinking && <ThinkingMessage onPause={onPauseThinking} modes={thinkingModes} />}
          </>
        )}

        {!isThinking && suggestions.length > 0 && (
          <SuggestedResponses suggestions={suggestions} onSelect={handleSuggestionSelect} />
        )}
      </div>

      <Composer
        ref={composerRef}
        onSend={async (text, files, modes) => {
          if (!text.trim() && (!files || files.length === 0)) return
          setBusy(true)
          setCurrentModes(modes || { thinking: false, search: false })
          await onSend?.(text, files, modes)
          setBusy(false)
        }}
        busy={busy}
        onModeChange={setCurrentModes}
      />
    </div>
  )
})

export default ChatPane
