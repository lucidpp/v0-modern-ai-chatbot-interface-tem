export const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
] as const

export type LanguageCode = (typeof languages)[number]["code"]

export const translations = {
  en: {
    newChat: "Start New Chat",
    search: "Search…",
    settings: "Settings",
    pinnedChats: "PINNED CHATS",
    recent: "RECENT",
    folders: "FOLDERS",
    templates: "TEMPLATES",
    theme: "Theme",
    language: "Language",
    getHelp: "Get Help",
    createFolder: "Create folder",
    createTemplate: "Create template",
    logout: "Logout",
    noConversations: "No conversations yet. Start a new one!",
    pinImportant: "Pin important threads for quick access.",
  },
  es: {
    newChat: "Nuevo Chat",
    search: "Buscar…",
    settings: "Configuración",
    pinnedChats: "CHATS FIJADOS",
    recent: "RECIENTES",
    folders: "CARPETAS",
    templates: "PLANTILLAS",
    theme: "Tema",
    language: "Idioma",
    getHelp: "Obtener Ayuda",
    createFolder: "Crear carpeta",
    createTemplate: "Crear plantilla",
    logout: "Cerrar sesión",
    noConversations: "Aún no hay conversaciones. ¡Comienza una nueva!",
    pinImportant: "Fija hilos importantes para acceso rápido.",
  },
  fr: {
    newChat: "Nouveau Chat",
    search: "Rechercher…",
    settings: "Paramètres",
    pinnedChats: "CHATS ÉPINGLÉS",
    recent: "RÉCENTS",
    folders: "DOSSIERS",
    templates: "MODÈLES",
    theme: "Thème",
    language: "Langue",
    getHelp: "Obtenir de l'aide",
    createFolder: "Créer un dossier",
    createTemplate: "Créer un modèle",
    logout: "Déconnexion",
    noConversations: "Pas encore de conversations. Commencez-en une nouvelle!",
    pinImportant: "Épinglez les fils importants pour un accès rapide.",
  },
  de: {
    newChat: "Neuer Chat",
    search: "Suchen…",
    settings: "Einstellungen",
    pinnedChats: "ANGEPINNTE CHATS",
    recent: "KÜRZLICH",
    folders: "ORDNER",
    templates: "VORLAGEN",
    theme: "Thema",
    language: "Sprache",
    getHelp: "Hilfe erhalten",
    createFolder: "Ordner erstellen",
    createTemplate: "Vorlage erstellen",
    logout: "Abmelden",
    noConversations: "Noch keine Gespräche. Starte ein neues!",
    pinImportant: "Wichtige Threads anheften für schnellen Zugriff.",
  },
  ja: {
    newChat: "新しいチャット",
    search: "検索…",
    settings: "設定",
    pinnedChats: "ピン留めチャット",
    recent: "最近",
    folders: "フォルダ",
    templates: "テンプレート",
    theme: "テーマ",
    language: "言語",
    getHelp: "ヘルプを取得",
    createFolder: "フォルダを作成",
    createTemplate: "テンプレートを作成",
    logout: "ログアウト",
    noConversations: "まだ会話がありません。新しく始めましょう！",
    pinImportant: "重要なスレッドをピン留めしてすばやくアクセス。",
  },
}

export function getLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en"
  const saved = localStorage.getItem("language") as LanguageCode
  return saved || "en"
}

export function setLanguage(code: LanguageCode) {
  localStorage.setItem("language", code)
}

export function t(key: keyof typeof translations.en, lang: LanguageCode = "en") {
  return translations[lang]?.[key] || translations.en[key] || key
}
