"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import ChatPane from "./ChatPane"
import ThemeToggle from "./ThemeToggle"
import ModelSelector from "./ModelSelector"
import LoginModal from "./LoginModal"
import MobileNav from "./MobileNav"
import CharactersPage from "./CharactersPage"
import { INITIAL_CONVERSATIONS, INITIAL_TEMPLATES, INITIAL_FOLDERS } from "./mockData"
import { sendChatMessage } from "@/lib/routeway-api"
import { getUser, createUser } from "@/lib/auth"
import { getCharacters } from "@/lib/characters"
import { applyTheme } from "@/lib/themes"

export default function AIAssistantUI() {
  const [user, setUser] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [currentView, setCurrentView] = useState("chat")
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  useEffect(() => {
    const existingUser = getUser()
    if (existingUser) {
      setUser(existingUser)
    } else {
      setShowLoginModal(true)
    }

    // Load default character
    const chars = getCharacters()
    setSelectedCharacter(chars.find((c) => c.id === "peyza-x12") || chars[0])
  }, [])

  const [theme, setTheme] = useState(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("theme")
    if (saved) return saved
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
      return "dark"
    return "light"
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      applyTheme(theme)
    }
  }, [theme])

  useEffect(() => {
    try {
      const media = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)")
      if (!media) return
      const listener = (e) => {
        const saved = localStorage.getItem("theme")
        if (!saved) setTheme(e.matches ? "dark" : "light")
      }
      media.addEventListener("change", listener)
      return () => media.removeEventListener("change", listener)
    } catch {}
  }, [])

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const raw = localStorage.getItem("sidebar-collapsed")
      return raw ? JSON.parse(raw) : { pinned: true, recent: false, folders: true, templates: true }
    } catch {
      return { pinned: true, recent: false, folders: true, templates: true }
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed))
    } catch {}
  }, [collapsed])

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem("sidebar-collapsed-state")
      return saved ? JSON.parse(saved) : false
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem("sidebar-collapsed-state", JSON.stringify(sidebarCollapsed))
    } catch {}
  }, [sidebarCollapsed])

  const [selectedModel, setSelectedModel] = useState(() => {
    try {
      const saved = localStorage.getItem("selected-model")
      return saved || "peyza-x12"
    } catch {
      return "peyza-x12"
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem("selected-model", selectedModel)
    } catch {}
  }, [selectedModel])

  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS)
  const [selectedId, setSelectedId] = useState(null)
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES)
  const [folders, setFolders] = useState(INITIAL_FOLDERS)

  const [query, setQuery] = useState("")
  const searchRef = useRef(null)

  const [isThinking, setIsThinking] = useState(false)
  const [thinkingConvId, setThinkingConvId] = useState(null)
  const [thinkingModes, setThinkingModes] = useState({ thinking: false, search: false })

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault()
        createNewChat()
      }
      if (!e.metaKey && !e.ctrlKey && e.key === "/") {
        const tag = document.activeElement?.tagName?.toLowerCase()
        if (tag !== "input" && tag !== "textarea") {
          e.preventDefault()
          searchRef.current?.focus()
        }
      }
      if (e.key === "Escape" && sidebarOpen) setSidebarOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [sidebarOpen, conversations])

  useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      createNewChat()
    }
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return conversations
    const q = query.toLowerCase()
    return conversations.filter((c) => c.title.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q))
  }, [conversations, query])

  const pinned = filtered.filter((c) => c.pinned).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))

  const recent = filtered
    .filter((c) => !c.pinned)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 10)

  const folderCounts = React.useMemo(() => {
    const map = Object.fromEntries(folders.map((f) => [f.name, 0]))
    for (const c of conversations) if (map[c.folder] != null) map[c.folder] += 1
    return map
  }, [conversations, folders])

  function togglePin(id) {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)))
  }

  function createNewChat() {
    const id = Math.random().toString(36).slice(2)
    const item = {
      id,
      title: "New Chat",
      updatedAt: new Date().toISOString(),
      messageCount: 0,
      preview: "Say hello to start...",
      pinned: false,
      folder: "Work Projects",
      messages: [],
    }
    setConversations((prev) => [item, ...prev])
    setSelectedId(id)
    setSidebarOpen(false)
    setCurrentView("chat")
  }

  function createFolder() {
    const name = prompt("Folder name")
    if (!name) return
    if (folders.some((f) => f.name.toLowerCase() === name.toLowerCase())) return alert("Folder already exists.")
    setFolders((prev) => [...prev, { id: Math.random().toString(36).slice(2), name }])
  }

  async function sendMessage(convId, content, files = [], modes = { thinking: false, search: false }) {
    if (!content.trim() && files.length === 0) return
    const now = new Date().toISOString()

    const userMsg = {
      id: Math.random().toString(36).slice(2),
      role: "user",
      content,
      files: files.map((f) => ({ name: f.name, type: f.type, size: f.size })),
      createdAt: now,
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c
        const msgs = [...(c.messages || []), userMsg]
        return {
          ...c,
          messages: msgs,
          updatedAt: now,
          messageCount: msgs.length,
          preview: content.slice(0, 80),
        }
      }),
    )

    setIsThinking(true)
    setThinkingConvId(convId)
    setThinkingModes(modes)

    const currentConvId = convId

    const conv = conversations.find((c) => c.id === convId)
    const messages = [...(conv?.messages || []), userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }))

    try {
      const modelToUse = selectedCharacter?.model || selectedModel
      const enhancedMessages = [...messages]
      if (modes.thinking || modes.search) {
        const lastMsg = enhancedMessages[enhancedMessages.length - 1]
        let prefix = ""
        if (modes.thinking && modes.search) {
          prefix = "[Deep Think + Web Search Mode] Search the web for current information and analyze deeply: "
        } else if (modes.thinking) {
          prefix = "[Deep Think Mode] Analyze this thoroughly and provide detailed reasoning: "
        } else if (modes.search) {
          prefix = "[Web Search Mode] Search for current information about: "
        }
        lastMsg.content = prefix + lastMsg.content
      }

      const response = await sendChatMessage(enhancedMessages, modelToUse)

      setIsThinking(false)
      setThinkingConvId(null)
      setThinkingModes({ thinking: false, search: false })

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== currentConvId) return c
          const asstMsg = {
            id: Math.random().toString(36).slice(2),
            role: "assistant",
            content: response,
            createdAt: new Date().toISOString(),
          }
          const msgs = [...(c.messages || []), asstMsg]
          return {
            ...c,
            messages: msgs,
            updatedAt: new Date().toISOString(),
            messageCount: msgs.length,
            preview: asstMsg.content.slice(0, 80),
          }
        }),
      )
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      setIsThinking(false)
      setThinkingConvId(null)
      setThinkingModes({ thinking: false, search: false })
    }
  }

  function editMessage(convId, messageId, newContent) {
    const now = new Date().toISOString()
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c
        const msgs = (c.messages || []).map((m) =>
          m.id === messageId ? { ...m, content: newContent, editedAt: now } : m,
        )
        return {
          ...c,
          messages: msgs,
          preview: msgs[msgs.length - 1]?.content?.slice(0, 80) || c.preview,
        }
      }),
    )
  }

  function resendMessage(convId, messageId) {
    const conv = conversations.find((c) => c.id === convId)
    const msg = conv?.messages?.find((m) => m.id === messageId)
    if (!msg) return
    sendMessage(convId, msg.content, msg.files || [])
  }

  function pauseThinking() {
    setIsThinking(false)
    setThinkingConvId(null)
  }

  function handleUseTemplate(template) {
    if (composerRef.current) {
      composerRef.current.insertTemplate(template.content)
    }
  }

  const composerRef = useRef(null)

  const selected = conversations.find((c) => c.id === selectedId) || null

  function handleLogin(name, email) {
    const newUser = createUser(name, email)
    setUser(newUser)
    setShowLoginModal(false)
  }

  function handleLogout() {
    setUser(null)
    setShowLoginModal(true)
  }

  function handleSelectCharacter(character) {
    setSelectedCharacter(character)
    setSelectedModel(character.model)
    setCurrentView("chat")
  }

  return (
    <div className="h-screen w-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <LoginModal isOpen={showLoginModal} onClose={() => {}} onLogin={handleLogin} />

      <div className="md:hidden sticky top-0 z-40 flex items-center gap-2 border-b border-zinc-200/60 bg-white/80 px-3 py-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="ml-1 flex items-center gap-2 text-sm font-semibold tracking-tight">
          <img
            src="/Favicon.jpg"
            alt=""
            className="h-5 w-5 rounded-md object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
          <span className="inline-flex h-4 w-4 items-center justify-center">✱</span> AI Assistant
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>

      <div className="mx-auto flex h-[calc(100vh-0px)] max-w-[1400px]">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          theme={theme}
          setTheme={setTheme}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          conversations={conversations}
          pinned={pinned}
          recent={recent}
          folders={folders}
          folderCounts={folderCounts}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id)
            setCurrentView("chat")
          }}
          togglePin={togglePin}
          query={query}
          setQuery={setQuery}
          searchRef={searchRef}
          createFolder={createFolder}
          createNewChat={createNewChat}
          templates={templates}
          setTemplates={setTemplates}
          onUseTemplate={handleUseTemplate}
          user={user}
          onLogout={handleLogout}
          onSelectCharacter={handleSelectCharacter}
          currentCharacterId={selectedCharacter?.id}
          onOpenCharacters={() => setCurrentView("characters")}
        />

        <main className="relative flex min-w-0 flex-1 flex-col pb-16 md:pb-0">
          {currentView === "chat" ? (
            <>
              <Header
                createNewChat={createNewChat}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarOpen={setSidebarOpen}
                modelSelector={<ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />}
              />
              <ChatPane
                ref={composerRef}
                conversation={selected}
                onSend={(content, files, modes) => selected && sendMessage(selected.id, content, files, modes)}
                onEditMessage={(messageId, newContent) => selected && editMessage(selected.id, messageId, newContent)}
                onResendMessage={(messageId) => selected && resendMessage(selected.id, messageId)}
                isThinking={isThinking && thinkingConvId === selected?.id}
                onPauseThinking={pauseThinking}
                userName={user?.name}
                thinkingModes={thinkingModes}
              />
            </>
          ) : (
            <CharactersPage onSelectCharacter={handleSelectCharacter} currentCharacterId={selectedCharacter?.id} />
          )}
        </main>
      </div>

      <MobileNav
        onOpenSidebar={() => setSidebarOpen(true)}
        onOpenCharacters={() => setCurrentView("characters")}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
    </div>
  )
}
