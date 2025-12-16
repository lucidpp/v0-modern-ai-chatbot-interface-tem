"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Sparkles, Users, MessageSquare, Trash2, X } from "lucide-react"
import { getCharacters, saveCharacter, deleteCharacter, type Character } from "@/lib/characters"
import { MODELS, type ModelType } from "@/lib/routeway-api"
import { cls } from "./utils"

interface CharactersPageProps {
  onSelectCharacter: (character: Character) => void
  currentCharacterId?: string
}

export default function CharactersPage({ onSelectCharacter, currentCharacterId }: CharactersPageProps) {
  const [characters, setCharacters] = useState<Character[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    setCharacters(getCharacters())
  }, [])

  function handleCreateCharacter(character: Omit<Character, "id" | "createdAt">) {
    const newChar = saveCharacter(character)
    setCharacters(getCharacters())
    setShowCreateModal(false)
  }

  function handleDeleteCharacter(id: string) {
    if (confirm("Are you sure you want to delete this character?")) {
      deleteCharacter(id)
      setCharacters(getCharacters())
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-zinc-50 px-4 py-6 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Characters</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Choose or create your AI assistant</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Plus className="h-4 w-4" />
            Create Character
          </button>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Official Characters
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {characters
              .filter((c) => c.isDefault)
              .map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  isSelected={currentCharacterId === character.id}
                  onSelect={() => onSelectCharacter(character)}
                  onDelete={null}
                />
              ))}
          </div>
        </div>

        {characters.filter((c) => !c.isDefault).length > 0 && (
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Custom Characters
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {characters
                .filter((c) => !c.isDefault)
                .map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    isSelected={currentCharacterId === character.id}
                    onSelect={() => onSelectCharacter(character)}
                    onDelete={() => handleDeleteCharacter(character.id)}
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateCharacterModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateCharacter} />
      )}
    </div>
  )
}

function CharacterCard({ character, isSelected, onSelect, onDelete }) {
  return (
    <div
      className={cls(
        "group relative cursor-pointer rounded-xl border-2 bg-white p-4 transition-all hover:shadow-lg dark:bg-zinc-900",
        isSelected ? "border-blue-500 shadow-md" : "border-zinc-200 dark:border-zinc-800",
      )}
      onClick={onSelect}
    >
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="absolute right-2 top-2 rounded-lg p-1.5 text-zinc-400 opacity-0 transition-opacity hover:bg-zinc-100 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-zinc-800"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}

      <div className="mb-3 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{character.name}</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{character.model}</p>
        </div>
      </div>

      <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">{character.description}</p>

      <div className="flex items-center gap-3 border-t border-zinc-100 pt-3 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          {character.chatCount >= 1000 ? `${(character.chatCount / 1000).toFixed(0)}k` : character.chatCount}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {character.userCount >= 1000 ? `${(character.userCount / 1000).toFixed(0)}k` : character.userCount}
        </span>
      </div>

      {isSelected && (
        <div className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-blue-500 text-white shadow-lg">
          <span className="text-xs">✓</span>
        </div>
      )}
    </div>
  )
}

function CreateCharacterModal({ onClose, onCreate }) {
  const [name, setName] = useState("")
  const [model, setModel] = useState<ModelType>("peyza-x12")
  const [description, setDescription] = useState("")
  const [personality, setPersonality] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !description.trim()) return

    onCreate({
      name: name.trim(),
      model,
      description: description.trim(),
      personality: personality.trim() || description.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg animate-in zoom-in-95 slide-in-from-bottom-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Create Custom Character</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Design your own AI assistant</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Character Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Custom Assistant"
              required
              className="w-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Base Model <span className="text-red-500">*</span>
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as ModelType)}
              className="w-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A helpful assistant that specializes in..."
              required
              rows={2}
              className="w-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Personality Traits (Optional)</label>
            <textarea
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="Friendly, professional, creative..."
              rows={2}
              className="w-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !description.trim()}
              className="flex-1 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Create Character
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
