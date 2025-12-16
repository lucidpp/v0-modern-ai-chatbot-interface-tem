"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X, Palette, Globe, HelpCircle, Sparkles } from "lucide-react"
import { themes, applyTheme, type ThemeId } from "@/lib/themes"
import { languages, type LanguageCode } from "@/lib/i18n"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  currentTheme: ThemeId
  onThemeChange: (theme: ThemeId) => void
  currentLanguage: LanguageCode
  onLanguageChange: (lang: LanguageCode) => void
}

export default function SettingsModal({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
  currentLanguage,
  onLanguageChange,
}: SettingsModalProps) {
  function handleGetHelp() {
    window.open("https://discord.gg/peyza-ai", "_blank")
  }

  return (
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                <h2 className="text-xl font-semibold">Settings</h2>
                <button onClick={onClose} className="rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 space-y-8" style={{ maxHeight: "calc(90vh - 80px)" }}>
                {/* Theme Selection */}
                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <Palette className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                    <h3 className="text-lg font-semibold">Theme</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          onThemeChange(theme.id)
                          applyTheme(theme.id)
                        }}
                        className={`group relative overflow-hidden rounded-lg border-2 p-4 text-left transition-all hover:scale-105 hover:shadow-lg ${
                          currentTheme === theme.id
                            ? "border-indigo-500 bg-indigo-50 shadow-md dark:bg-indigo-950/30"
                            : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`h-8 w-8 rounded-md bg-gradient-to-br ${getThemeGradient(theme.id)} shadow-sm`}
                          />
                          <Sparkles
                            className={`h-4 w-4 ${currentTheme === theme.id ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`}
                          />
                        </div>
                        <div className="font-semibold text-sm">{theme.name}</div>
                        {currentTheme === theme.id && (
                          <motion.div
                            layoutId="theme-active"
                            className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-lg"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Language Selection */}
                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                    <h3 className="text-lg font-semibold">Language</h3>
                  </div>
                  <div className="grid gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => onLanguageChange(lang.code)}
                        className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all hover:scale-[1.02] hover:shadow-md ${
                          currentLanguage === lang.code
                            ? "border-indigo-500 bg-indigo-50 shadow-md dark:bg-indigo-950/30"
                            : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="font-semibold">{lang.name}</span>
                        {currentLanguage === lang.code && (
                          <motion.div
                            layoutId="language-active"
                            className="ml-auto h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-lg"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Help Section */}
                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                    <h3 className="text-lg font-semibold">Support</h3>
                  </div>
                  <button
                    onClick={handleGetHelp}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                  >
                    <HelpCircle className="h-5 w-5" />
                    Get Help & Join Community
                  </button>
                  <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Join our Discord community for support, updates, and more!
                  </p>
                </section>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

function getThemeGradient(themeId: string) {
  const gradients: Record<string, string> = {
    light: "from-zinc-100 to-zinc-300",
    dark: "from-zinc-800 to-zinc-950",
    ocean: "from-blue-400 to-blue-600",
    forest: "from-green-400 to-green-600",
    sunset: "from-orange-400 to-red-500",
    midnight: "from-purple-600 to-indigo-900",
    rose: "from-pink-400 to-rose-600",
  }
  return gradients[themeId] || gradients.light
}
