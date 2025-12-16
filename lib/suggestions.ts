export function generateSuggestions(lastMessage: string | undefined, role: string): string[] {
  if (!lastMessage) {
    return [
      "What can you help me with?",
      "Tell me a fun fact",
      "Help me brainstorm ideas",
      "Explain something complex simply",
    ]
  }

  if (role === "assistant") {
    const lower = lastMessage.toLowerCase()

    if (lower.includes("?")) {
      return ["Tell me more", "Can you give an example?", "What are the benefits?", "Any alternatives?"]
    }

    if (lower.includes("code") || lower.includes("function") || lower.includes("programming")) {
      return ["Explain this code", "Add error handling", "Optimize this", "Show me a different approach"]
    }

    if (lower.includes("write") || lower.includes("create") || lower.includes("generate")) {
      return ["Make it longer", "Make it more concise", "Change the tone", "Add more details"]
    }

    return ["Continue", "Give me another example", "Explain differently", "What's next?"]
  }

  return []
}
