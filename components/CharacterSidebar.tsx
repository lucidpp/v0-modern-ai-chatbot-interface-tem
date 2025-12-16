"use client"
import { motion, AnimatePresence } from "framer-motion"
import type React from "react"

import { X, Users, MessageCircle, Plus, Phone, PhoneOff } from "lucide-react"
import { getCharacters, type Character } from "@/lib/characters"
import { useState, useEffect } from "react"

interface CharacterSidebarProps {
  isOpen: boolean
  onClose: () => void
  onSelectCharacter: (character: Character) => void
  currentCharacterId?: string
  onOpenCreateCharacter: () => void
}

export default function CharacterSidebar({
  isOpen,
  onClose,
  onSelectCharacter,
  currentCharacterId,
  onOpenCreateCharacter,
}: CharacterSidebarProps) {
  const [characters, setCharacters] = useState<Character[]>([])
  const [isCalling, setIsCalling] = useState(false)
  const [callingCharacter, setCallingCharacter] = useState<Character | null>(null)

  useEffect(() => {
    setCharacters(getCharacters())
  }, [isOpen])

  function handleCall(character: Character, e: React.MouseEvent) {
    e.stopPropagation()
    setCallingCharacter(character)
    setIsCalling(true)
    // Simulate call duration
    setTimeout(() => {
      setIsCalling(false)
      setCallingCharacter(null)
    }, 5000)
  }

  function handleEndCall() {
    setIsCalling(false)
    setCallingCharacter(null)
  }

  function formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-sm border-r border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
                  <h2 className="text-lg font-semibold">Characters</h2>
                  <button onClick={onClose} className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="px-4 py-3">
                  <button
                    onClick={() => {
                      onOpenCreateCharacter()
                      onClose()
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
                  >
                    <Plus className="h-4 w-4" /> Create New Character
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Official Peyza Models
                  </div>
                  <div className="space-y-2">
                    {characters
                      .filter((c) => c.isDefault)
                      .map((character) => (
                        <CharacterCard
                          key={character.id}
                          character={character}
                          isActive={character.id === currentCharacterId}
                          onSelect={() => {
                            onSelectCharacter(character)
                            onClose()
                          }}
                          onCall={(e) => handleCall(character, e)}
                          formatNumber={formatNumber}
                        />
                      ))}
                  </div>

                  {characters.some((c) => !c.isDefault) && (
                    <>
                      <div className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Custom Characters
                      </div>
                      <div className="space-y-2">
                        {characters
                          .filter((c) => !c.isDefault)
                          .map((character) => (
                            <CharacterCard
                              key={character.id}
                              character={character}
                              isActive={character.id === currentCharacterId}
                              onSelect={() => {
                                onSelectCharacter(character)
                                onClose()
                              }}
                              onCall={(e) => handleCall(character, e)}
                              formatNumber={formatNumber}
                            />
                          ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCalling && callingCharacter && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-lg"
          >
            <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 text-center shadow-2xl dark:from-zinc-950 dark:to-zinc-900">
              <div className="mb-6">
                <div className="mx-auto mb-4 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-2xl font-bold text-white shadow-lg">
                  {callingCharacter.name.slice(0, 2).toUpperCase()}
                </div>
                <h3 className="text-2xl font-semibold text-white">{callingCharacter.name}</h3>
                <p className="mt-2 text-sm text-zinc-400">Voice call in progress...</p>
              </div>

              <div className="mb-6 flex items-center justify-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                  className="h-2 w-2 rounded-full bg-green-500"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, delay: 0.2 }}
                  className="h-3 w-3 rounded-full bg-green-500"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, delay: 0.4 }}
                  className="h-2 w-2 rounded-full bg-green-500"
                />
              </div>

              <button
                onClick={handleEndCall}
                className="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-red-600 hover:scale-105"
              >
                <PhoneOff className="h-5 w-5" />
                End Call
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function CharacterCard({
  character,
  isActive,
  onSelect,
  onCall,
  formatNumber,
}: {
  character: Character
  isActive: boolean
  onSelect: () => void
  onCall: (e: React.MouseEvent) => void
  formatNumber: (num: number) => string
}) {
  return (
    <button
      onClick={onSelect}
      className={`group relative w-full rounded-xl border-2 p-4 text-left transition-all hover:shadow-lg ${
        isActive
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
          : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
      }`}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="font-semibold">{character.name}</h3>
            {isActive && (
              <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-medium text-white">ACTIVE</span>
            )}
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{character.description}</p>
        </div>
        <button
          onClick={onCall}
          className="shrink-0 rounded-lg p-2 text-zinc-400 transition-all hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-950/50 dark:hover:text-green-400"
          title="Call this character"
        >
          <Phone className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          <span>{formatNumber(character.userCount)} users</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="h-3.5 w-3.5" />
          <span>{formatNumber(character.chatCount)} chats</span>
        </div>
      </div>

      {character.personality && (
        <div className="mt-2 rounded-lg bg-zinc-50 px-2 py-1 text-[11px] italic text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400">
          {character.personality}
        </div>
      )}
    </button>
  )
}
