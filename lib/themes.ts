export const themes = [
  { id: "light", name: "Light", primary: "zinc" },
  { id: "dark", name: "Dark", primary: "zinc" },
  { id: "ocean", name: "Ocean Blue", primary: "blue" },
  { id: "forest", name: "Forest Green", primary: "green" },
  { id: "sunset", name: "Sunset Orange", primary: "orange" },
  { id: "midnight", name: "Midnight Purple", primary: "purple" },
  { id: "rose", name: "Rose Pink", primary: "pink" },
] as const

export type ThemeId = (typeof themes)[number]["id"]

export function applyTheme(themeId: ThemeId) {
  const root = document.documentElement

  // Remove all theme classes
  themes.forEach((t) => root.classList.remove(t.id))

  // Add new theme class
  root.classList.add(themeId)

  if (themeId === "dark" || themeId === "midnight" || themeId === "forest") {
    root.classList.add("dark")
    root.style.colorScheme = "dark"
  } else {
    root.classList.remove("dark")
    root.style.colorScheme = "light"
  }

  root.setAttribute("data-theme", themeId)
  localStorage.setItem("theme", themeId)
}

export function getTheme(): ThemeId {
  if (typeof window === "undefined") return "light"
  const saved = localStorage.getItem("theme") as ThemeId
  return saved || "light"
}
