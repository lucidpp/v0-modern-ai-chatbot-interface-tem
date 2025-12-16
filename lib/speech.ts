export async function startVoiceRecording(): Promise<MediaRecorder | null> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    return mediaRecorder
  } catch (error) {
    console.error("[v0] Failed to start voice recording:", error)
    return null
  }
}

export function stopVoiceRecording(mediaRecorder: MediaRecorder): Promise<Blob> {
  return new Promise((resolve) => {
    const chunks: Blob[] = []

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" })
      resolve(blob)
    }

    mediaRecorder.stop()
    mediaRecorder.stream.getTracks().forEach((track) => track.stop())
  })
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  // For now, return a placeholder
  // In a real implementation, you would send this to a speech-to-text API
  return "Voice message transcribed"
}
