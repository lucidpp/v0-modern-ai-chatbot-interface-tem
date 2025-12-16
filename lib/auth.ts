export interface User {
  id: string
  name: string
  email?: string
  avatar?: string
  createdAt: string
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function saveUser(user: User): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("user", JSON.stringify(user))
  } catch (error) {
    console.error("[v0] Failed to save user:", error)
  }
}

export function createUser(name: string, email?: string): User {
  const user: User = {
    id: Math.random().toString(36).slice(2),
    name,
    email,
    createdAt: new Date().toISOString(),
  }

  saveUser(user)
  return user
}

export function logoutUser(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem("user")
  } catch (error) {
    console.error("[v0] Failed to logout user:", error)
  }
}

export function getUserInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}
