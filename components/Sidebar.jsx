"use client"
import { motion } from "framer-motion"
import {
  PanelLeftClose,
  PanelLeftOpen,
  SearchIcon,
  Plus,
  Star,
  Clock,
  FolderIcon,
  FileText,
  HelpCircle,
  LogOut,
  Bot,
} from "lucide-react"
import SidebarSection from "./SidebarSection"
import ConversationRow from "./ConversationRow"
import FolderRow from "./FolderRow"
import TemplateRow from "./TemplateRow"
import ThemeToggle from "./ThemeToggle"
import CreateFolderModal from "./CreateFolderModal"
import CreateTemplateModal from "./CreateTemplateModal"
import SearchModal from "./SearchModal"
import CharacterSidebar from "./CharacterSidebar"
import { cls } from "./utils"
import { useState } from "react"
import { getUserInitials, logoutUser } from "@/lib/auth"
import { getLanguage, setLanguage, t } from "@/lib/i18n"
import { getCharacters } from "@/lib/characters"

export default function Sidebar({
  open,
  onClose,
  theme,
  setTheme,
  collapsed,
  setCollapsed,
  conversations,
  pinned,
  recent,
  folders,
  folderCounts,
  selectedId,
  onSelect,
  togglePin,
  query,
  setQuery,
  searchRef,
  createFolder,
  createNewChat,
  templates = [],
  setTemplates = () => {},
  onUseTemplate = () => {},
  sidebarCollapsed = false,
  setSidebarCollapsed = () => {},
  user = null,
  onSelectCharacter = () => {},
  currentCharacterId = null,
  onOpenCharacters = () => {},
}) {
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showCharacterSidebar, setShowCharacterSidebar] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState(() => getLanguage())

  const handleSearchClick = () => {
    setShowSearchModal(true)
  }

  const handleNewChatClick = () => {
    createNewChat()
  }

  const handleFoldersClick = () => {
    // Expand sidebar and open folders section
    setSidebarCollapsed(false)
    setCollapsed((s) => ({ ...s, folders: false }))
  }

  const getConversationsByFolder = (folderName) => {
    return conversations.filter((conv) => conv.folder === folderName)
  }

  const handleCreateFolder = (folderName) => {
    createFolder(folderName)
  }

  const handleDeleteFolder = (folderName) => {
    const updatedConversations = conversations.map((conv) =>
      conv.folder === folderName ? { ...conv, folder: null } : conv,
    )
    console.log("Delete folder:", folderName, "Updated conversations:", updatedConversations)
  }

  const handleRenameFolder = (oldName, newName) => {
    const updatedConversations = conversations.map((conv) =>
      conv.folder === oldName ? { ...conv, folder: newName } : conv,
    )
    console.log("Rename folder:", oldName, "to", newName, "Updated conversations:", updatedConversations)
  }

  const handleCreateTemplate = (templateData) => {
    if (editingTemplate) {
      const updatedTemplates = templates.map((t) =>
        t.id === editingTemplate.id ? { ...templateData, id: editingTemplate.id } : t,
      )
      setTemplates(updatedTemplates)
      setEditingTemplate(null)
    } else {
      const newTemplate = {
        ...templateData,
        id: Date.now().toString(),
      }
      setTemplates([...templates, newTemplate])
    }
    setShowCreateTemplateModal(false)
  }

  const handleEditTemplate = (template) => {
    setEditingTemplate(template)
    setShowCreateTemplateModal(true)
  }

  const handleRenameTemplate = (templateId, newName) => {
    const updatedTemplates = templates.map((t) =>
      t.id === templateId ? { ...t, name: newName, updatedAt: new Date().toISOString() } : t,
    )
    setTemplates(updatedTemplates)
  }

  const handleDeleteTemplate = (templateId) => {
    const updatedTemplates = templates.filter((t) => t.id !== templateId)
    setTemplates(updatedTemplates)
  }

  const handleUseTemplate = (template) => {
    onUseTemplate(template)
  }

  function handleLogout() {
    if (confirm("Are you sure you want to log out?")) {
      logoutUser()
      onClose()
    }
  }

  function handleLanguageChange(lang) {
    setCurrentLanguage(lang)
    setLanguage(lang)
    // Force re-render to update all translations
    window.location.reload()
  }

  if (sidebarCollapsed) {
    return (
      <>
        <motion.aside
          initial={{ width: 320 }}
          animate={{ width: 64 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="z-50 flex h-full shrink-0 flex-col border-r border-zinc-200/60 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-center justify-center border-b border-zinc-200/60 px-3 py-3 dark:border-zinc-800">
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
              aria-label="Open sidebar"
              title="Open sidebar"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center gap-2 pt-4">
            <button
              onClick={handleNewChatClick}
              className="rounded-xl p-2.5 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800 transition-colors"
              title="New Chat"
            >
              <Plus className="h-5 w-5" />
            </button>

            <button
              onClick={handleSearchClick}
              className="rounded-xl p-2.5 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800 transition-colors"
              title="Search chats"
            >
              <SearchIcon className="h-5 w-5" />
            </button>

            <button
              onClick={() => setShowCharacterSidebar(true)}
              className="rounded-xl p-2.5 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800 transition-colors"
              title="Characters"
            >
              <Bot className="h-5 w-5" />
            </button>

            <button
              onClick={handleFoldersClick}
              className="rounded-xl p-2.5 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800 transition-colors"
              title="Folders"
            >
              <FolderIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-auto flex flex-col items-center gap-2 pb-4">
            <button
              onClick={() => window.open("https://discord.gg/peyza", "_blank")}
              className="rounded-xl p-2.5 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
              title="Get Help"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
            <button
              onClick={handleLogout}
              className="rounded-xl p-2.5 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </motion.aside>

        <SearchModal
          isOpen={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          conversations={conversations}
          selectedId={selectedId}
          onSelect={onSelect}
          togglePin={togglePin}
          createNewChat={createNewChat}
        />

        <CharacterSidebar
          isOpen={showCharacterSidebar}
          onClose={() => setShowCharacterSidebar(false)}
          onSelectCharacter={onSelectCharacter}
          currentCharacterId={currentCharacterId}
          onOpenCreateCharacter={onOpenCharacters}
        />
      </>
    )
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cls(
          "bg-zinc-50/95 dark:bg-zinc-900/95 backdrop-blur-sm border-r border-zinc-200/60 dark:border-zinc-800/60",
          "fixed z-50 h-full w-[85vw] max-w-[320px] transition-transform duration-300 md:static md:z-auto md:block",
          sidebarCollapsed ? "md:w-16" : "md:w-80 lg:w-80 xl:w-96",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 border-b border-zinc-200/60 px-3 py-3 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 overflow-hidden rounded-lg shadow-sm bg-gradient-to-br from-indigo-600 to-purple-600 p-0.5">
                <img
                  src="/Favicon.svg"
                  alt="Peyza AI"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/Favicon.jpg"
                  }}
                />
              </div>
              <div className="text-sm font-semibold tracking-tight">Peyza AI</div>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="hidden md:block rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
                aria-label="Close sidebar"
                title="Close sidebar"
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>

              <button
                onClick={onClose}
                className="md:hidden rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
                aria-label="Close sidebar"
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="px-3 pt-3">
            <label htmlFor="search" className="sr-only">
              Search conversations
            </label>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                id="search"
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                onClick={() => setShowSearchModal(true)}
                onFocus={() => setShowSearchModal(true)}
                className="w-full rounded-full border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950/50"
              />
            </div>
          </div>

          <div className="px-3 pt-3">
            <button
              onClick={createNewChat}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-white dark:text-zinc-900"
              title="New Chat (⌘N)"
            >
              <Plus className="h-4 w-4" /> Start New Chat
            </button>
          </div>

          <nav className="mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-2 pb-4">
            <SidebarSection
              icon={<Bot className="h-4 w-4" />}
              title="CHARACTERS"
              collapsed={collapsed.characters || false}
              onToggle={() => setCollapsed((s) => ({ ...s, characters: !s.characters }))}
            >
              <button
                onClick={() => setShowCharacterSidebar(true)}
                className="w-full rounded-lg border border-dashed border-zinc-200 px-3 py-3 text-center text-xs text-zinc-600 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
              >
                Browse {getCharacters().length} characters
              </button>
            </SidebarSection>

            <SidebarSection
              icon={<Star className="h-4 w-4" />}
              title="PINNED CHATS"
              collapsed={collapsed.pinned}
              onToggle={() => setCollapsed((s) => ({ ...s, pinned: !s.pinned }))}
            >
              {pinned.length === 0 ? (
                <div className="select-none rounded-lg border border-dashed border-zinc-200 px-3 py-3 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  Pin important threads for quick access.
                </div>
              ) : (
                pinned.map((c) => (
                  <ConversationRow
                    key={c.id}
                    data={c}
                    active={c.id === selectedId}
                    onSelect={() => onSelect(c.id)}
                    onTogglePin={() => togglePin(c.id)}
                  />
                ))
              )}
            </SidebarSection>

            <SidebarSection
              icon={<Clock className="h-4 w-4" />}
              title="RECENT"
              collapsed={collapsed.recent}
              onToggle={() => setCollapsed((s) => ({ ...s, recent: !s.recent }))}
            >
              {recent.length === 0 ? (
                <div className="select-none rounded-lg border border-dashed border-zinc-200 px-3 py-3 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  No conversations yet. Start a new one!
                </div>
              ) : (
                recent.map((c) => (
                  <ConversationRow
                    key={c.id}
                    data={c}
                    active={c.id === selectedId}
                    onSelect={() => onSelect(c.id)}
                    onTogglePin={() => togglePin(c.id)}
                    showMeta
                  />
                ))
              )}
            </SidebarSection>

            <SidebarSection
              icon={<FolderIcon className="h-4 w-4" />}
              title="FOLDERS"
              collapsed={collapsed.folders}
              onToggle={() => setCollapsed((s) => ({ ...s, folders: !s.folders }))}
            >
              <div className="-mx-1">
                <button
                  onClick={() => setShowCreateFolderModal(true)}
                  className="mb-2 inline-flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <Plus className="h-4 w-4" /> Create folder
                </button>

                {folders.map((f) => (
                  <FolderRow
                    key={f.id}
                    name={f.name}
                    count={folderCounts[f.name] || 0}
                    conversations={getConversationsByFolder(f.name)}
                    selectedId={selectedId}
                    onSelect={onSelect}
                    togglePin={togglePin}
                    onDeleteFolder={handleDeleteFolder}
                    onRenameFolder={handleRenameFolder}
                  />
                ))}
              </div>
            </SidebarSection>

            <SidebarSection
              icon={<FileText className="h-4 w-4" />}
              title="TEMPLATES"
              collapsed={collapsed.templates}
              onToggle={() => setCollapsed((s) => ({ ...s, templates: !s.templates }))}
            >
              <div className="-mx-1">
                <button
                  onClick={() => setShowCreateTemplateModal(true)}
                  className="mb-2 inline-flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <Plus className="h-4 w-4" /> Create template
                </button>

                {(Array.isArray(templates) ? templates : []).map((template) => (
                  <TemplateRow
                    key={template.id}
                    template={template}
                    onUseTemplate={handleUseTemplate}
                    onEditTemplate={handleEditTemplate}
                    onRenameTemplate={handleRenameTemplate}
                    onDeleteTemplate={handleDeleteTemplate}
                  />
                ))}

                {(!templates || templates.length === 0) && (
                  <div className="select-none rounded-lg border border-dashed border-zinc-200 px-3 py-3 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                    No templates yet. Create your first prompt template.
                  </div>
                )}
              </div>
            </SidebarSection>
          </nav>

          <div className="mt-auto border-t border-zinc-200/60 px-3 py-3 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.open("https://discord.gg/peyza", "_blank")}
                className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
              >
                <HelpCircle className="h-4 w-4" /> {t("getHelp")}
              </button>
              <div className="ml-auto">
                <ThemeToggle theme={theme} setTheme={setTheme} />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-xl bg-zinc-50 p-2 dark:bg-zinc-800/60">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
                {user ? getUserInitials(user.name) : "U"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{user?.name || "Guest User"}</div>
                <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {user?.email || "Local workspace"}
                </div>
              </div>
              {user && (
                <button
                  onClick={handleLogout}
                  className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  title="Logout"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>

        {showCharacterSidebar && (
          <CharacterSidebar
            onClose={() => setShowCharacterSidebar(false)}
            onSelectCharacter={onSelectCharacter}
            currentCharacterId={currentCharacterId}
          />
        )}
      </aside>

      <CreateFolderModal
        isOpen={showCreateFolderModal}
        onClose={() => setShowCreateFolderModal(false)}
        onCreate={handleCreateFolder}
      />

      <CreateTemplateModal
        isOpen={showCreateTemplateModal}
        onClose={() => {
          setShowCreateTemplateModal(false)
          setEditingTemplate(null)
        }}
        onCreate={handleCreateTemplate}
        initialTemplate={editingTemplate}
      />

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        conversations={conversations}
        onSelect={onSelect}
      />
    </>
  )
}
