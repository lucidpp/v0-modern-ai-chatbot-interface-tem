"use client"

import { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react"
import { Send, Paperclip, Mic, ImageIcon, X, Square, Brain, Search } from "lucide-react"
import { startVoiceRecording, stopVoiceRecording, transcribeAudio } from "@/lib/speech"

const Composer = forwardRef(function Composer({ onSend, busy, onModeChange }, ref) {
  const [text, setText] = useState("")
  const [files, setFiles] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [thinkingMode, setThinkingMode] = useState(false)
  const [searchMode, setSearchMode] = useState(false)
  const mediaRecorderRef = useRef(null)
  const timerRef = useRef(null)

  useImperativeHandle(
    ref,
    () => ({
      insertTemplate: (templateContent) => {
        setText((prev) => (prev ? `${prev}\n\n${templateContent}` : templateContent))
      },
    }),
    [],
  )

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    onModeChange?.({ thinking: thinkingMode, search: searchMode })
  }, [thinkingMode, searchMode, onModeChange])

  async function submit() {
    const trimmedText = text.trim()

    console.log("[v0] Composer submit - text:", text)
    console.log("[v0] Composer submit - trimmedText:", trimmedText)
    console.log("[v0] Composer submit - files.length:", files.length)

    if (!trimmedText && files.length === 0) {
      console.log("[v0] Composer submit - early return, no content")
      return
    }

    const content = trimmedText
    const filesToSend = [...files]
    const modes = { thinking: thinkingMode, search: searchMode }

    console.log("[v0] Composer submit - calling onSend with:", { content, filesToSend, modes })

    await onSend?.(content, filesToSend, modes)

    setText("")
    setFiles([])
  }

  function handleFileSelect(e) {
    const selected = Array.from(e.target.files || [])
    setFiles((prev) => [...prev, ...selected])
  }

  function removeFile(idx) {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  async function toggleRecording() {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        const audioBlob = await stopVoiceRecording(mediaRecorderRef.current)
        const transcription = await transcribeAudio(audioBlob)
        setText((prev) => (prev ? `${prev} ${transcription}` : transcription))
        mediaRecorderRef.current = null
      }
      setIsRecording(false)
      setRecordingTime(0)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    } else {
      // Start recording
      const recorder = await startVoiceRecording()
      if (recorder) {
        mediaRecorderRef.current = recorder
        recorder.start()
        setIsRecording(true)
        setRecordingTime(0)
        timerRef.current = setInterval(() => {
          setRecordingTime((t) => t + 1)
        }, 1000)
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="border-t border-zinc-200/60 bg-white/80 p-3 backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-950/80 sm:p-4">
      {isRecording && (
        <div className="mb-2 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 dark:bg-red-950/20">
          <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span className="text-sm text-red-600 dark:text-red-400">Recording: {formatTime(recordingTime)}</span>
          <button
            onClick={toggleRecording}
            className="ml-auto inline-flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
          >
            <Square className="h-3 w-3" /> Stop
          </button>
        </div>
      )}

      <div className="mb-2 flex items-center gap-2">
        <button
          onClick={() => setThinkingMode(!thinkingMode)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
            thinkingMode
              ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30 ring-2 ring-purple-400"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:shadow-md dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          }`}
        >
          <Brain className="h-3.5 w-3.5" />
          Deep Think
        </button>
        <button
          onClick={() => setSearchMode(!searchMode)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
            searchMode
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:shadow-md dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          }`}
        >
          <Search className="h-3.5 w-3.5" />
          Web Search
        </button>
        {(thinkingMode || searchMode) && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {thinkingMode && searchMode
              ? "AI will search the web and think deeply"
              : thinkingMode
                ? "AI will analyze deeply before responding"
                : "AI will search the web for current info"}
          </span>
        )}
      </div>

      {files.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs dark:border-zinc-800 dark:bg-zinc-900"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span className="max-w-[150px] truncate">{file.name}</span>
              <button
                onClick={() => removeFile(idx)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="group relative flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                submit()
              }
            }}
            placeholder={isRecording ? "Recording..." : "Type a message..."}
            rows={1}
            disabled={busy || isRecording}
            className="glass-input w-full resize-none rounded-xl border-2 border-zinc-200/60 bg-white/90 px-4 py-3 pr-24 text-sm outline-none backdrop-blur-sm placeholder:text-zinc-400 transition-all duration-300 focus:border-transparent focus:shadow-[0_0_0_3px_rgba(147,197,253,0.3)] focus:ring-2 focus:ring-blue-400 hover:border-zinc-300/80 hover:shadow-[0_0_15px_rgba(0,0,0,0.05)] disabled:opacity-50 dark:border-zinc-700/60 dark:bg-zinc-900/90 dark:placeholder:text-zinc-500 dark:focus:shadow-[0_0_0_3px_rgba(96,165,250,0.2)] dark:hover:border-zinc-600/80 dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.03)]"
          />
          <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10 animate-shimmer"></div>
          </div>
          <div className="absolute bottom-2.5 right-2 flex items-center gap-1">
            <label
              className={`cursor-pointer rounded-lg p-1.5 text-zinc-400 transition-all ${
                isRecording
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-zinc-100 hover:text-zinc-600 hover:scale-110 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              }`}
            >
              <Paperclip className="h-4 w-4" />
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                disabled={isRecording}
              />
            </label>
            <button
              onClick={toggleRecording}
              className={`rounded-lg p-1.5 transition-all ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse scale-110"
                  : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 hover:scale-110 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              }`}
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>
        </div>
        <button
          onClick={submit}
          disabled={busy || isRecording || (!text.trim() && files.length === 0)}
          className="shrink-0 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:hover:scale-100 dark:from-indigo-500 dark:to-purple-500"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
})

export default Composer
