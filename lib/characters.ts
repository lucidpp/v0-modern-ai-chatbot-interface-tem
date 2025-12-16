import type { ModelType } from "./routeway-api"

export interface Character {
  id: string
  name: string
  model: ModelType
  description: string
  personality: string
  avatar?: string
  isDefault: boolean
  chatCount: number
  userCount: number
  createdAt: string
}

export const DEFAULT_CHARACTERS: Character[] = [
  {
    id: "peyza-x2",
    name: "Peyza X2",
    model: "peyza-x2",
    description: "Fast and efficient AI assistant",
    personality: "Quick, concise, and to the point. Perfect for fast responses.",
    isDefault: true,
    chatCount: 29000,
    userCount: 192000,
    createdAt: new Date().toISOString(),
  },
  {
    id: "peyza-x6",
    name: "Peyza X6",
    model: "peyza-x6",
    description: "Balanced AI with great reasoning",
    personality: "Balanced and thoughtful. Great for complex conversations.",
    isDefault: true,
    chatCount: 45000,
    userCount: 285000,
    createdAt: new Date().toISOString(),
  },
  {
    id: "peyza-x12",
    name: "Peyza X12",
    model: "peyza-x12",
    description: "Most advanced AI with deep knowledge",
    personality: "Highly intelligent and creative. Best for advanced tasks.",
    isDefault: true,
    chatCount: 67000,
    userCount: 412000,
    createdAt: new Date().toISOString(),
  },
]

export function getCharacters(): Character[] {
  if (typeof window === "undefined") return DEFAULT_CHARACTERS

  try {
    const stored = localStorage.getItem("characters")
    if (stored) {
      const custom = JSON.parse(stored)
      return [...DEFAULT_CHARACTERS, ...custom]
    }
    return DEFAULT_CHARACTERS
  } catch {
    return DEFAULT_CHARACTERS
  }
}

export function saveCharacter(character: Omit<Character, "id" | "createdAt">): Character {
  const newCharacter: Character = {
    ...character,
    id: Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString(),
    isDefault: false,
    chatCount: 0,
    userCount: 1,
  }

  try {
    const stored = localStorage.getItem("characters")
    const custom = stored ? JSON.parse(stored) : []
    custom.push(newCharacter)
    localStorage.setItem("characters", JSON.stringify(custom))
  } catch (error) {
    console.error("[v0] Failed to save character:", error)
  }

  return newCharacter
}

export function deleteCharacter(id: string): void {
  try {
    const stored = localStorage.getItem("characters")
    if (stored) {
      const custom = JSON.parse(stored)
      const filtered = custom.filter((c: Character) => c.id !== id)
      localStorage.setItem("characters", JSON.stringify(filtered))
    }
  } catch (error) {
    console.error("[v0] Failed to delete character:", error)
  }
}
