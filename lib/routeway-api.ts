const API_KEY = "sk-kpF8Py3rIxM6ntFilq5Ago7ilnRpEoDJYOXoFBcMFPlwcHFi"
const API_URL = "https://api.routeway.ai/v1/chat/completions"

export type ModelType = "peyza-x2" | "peyza-x6" | "peyza-x12"

export interface ModelConfig {
  id: ModelType
  name: string
  description: string
  chatCount: string
  userCount: string
}

export const MODELS: ModelConfig[] = [
  {
    id: "peyza-x2",
    name: "Peyza X2",
    description: "Fast and efficient model",
    chatCount: "29k",
    userCount: "192k",
  },
  {
    id: "peyza-x6",
    name: "Peyza X6",
    description: "Balanced performance",
    chatCount: "45k",
    userCount: "285k",
  },
  {
    id: "peyza-x12",
    name: "Peyza X12",
    description: "Most advanced model",
    chatCount: "67k",
    userCount: "412k",
  },
]

export async function sendChatMessage(
  messages: Array<{ role: string; content: string }>,
  selectedModel: ModelType,
  onStream?: (chunk: string) => void,
): Promise<string> {
  console.log("[v0] API sendChatMessage called:", { messages, selectedModel })

  try {
    const requestBody = {
      model: "kimi-k2-0905:free",
      messages: [
        {
          role: "system",
          content: `You are ${MODELS.find((m) => m.id === selectedModel)?.name}, an advanced AI assistant. You are helpful, friendly, and knowledgeable.`,
        },
        ...messages,
      ],
    }

    console.log("[v0] API request body:", JSON.stringify(requestBody, null, 2))

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    console.log("[v0] API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] API error response:", errorText)
      throw new Error(`API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("[v0] API response data:", data)

    const content = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."
    console.log("[v0] API extracted content:", content)

    return content
  } catch (error) {
    console.error("[v0] Routeway API error:", error)
    throw error
  }
}
