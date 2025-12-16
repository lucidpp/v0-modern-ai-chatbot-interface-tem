export interface DetectedLink {
  url: string
  displayText: string
  startIndex: number
  endIndex: number
}

export function detectLinks(text: string): DetectedLink[] {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(com|org|net|io|ai|app|dev|co)[^\s]*)/gi
  const links: DetectedLink[] = []
  let match

  while ((match = urlRegex.exec(text)) !== null) {
    let url = match[0]
    const displayText = url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")

    // Add protocol if missing
    if (!url.startsWith("http")) {
      url = "https://" + url
    }

    links.push({
      url,
      displayText,
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    })
  }

  return links
}

export function renderTextWithLinks(text: string): Array<{ type: "text" | "link"; content: string; url?: string }> {
  const links = detectLinks(text)

  if (links.length === 0) {
    return [{ type: "text", content: text }]
  }

  const result: Array<{ type: "text" | "link"; content: string; url?: string }> = []
  let lastIndex = 0

  for (const link of links) {
    // Add text before the link
    if (link.startIndex > lastIndex) {
      result.push({
        type: "text",
        content: text.substring(lastIndex, link.startIndex),
      })
    }

    // Add the link
    result.push({
      type: "link",
      content: link.displayText,
      url: link.url,
    })

    lastIndex = link.endIndex
  }

  // Add remaining text
  if (lastIndex < text.length) {
    result.push({
      type: "text",
      content: text.substring(lastIndex),
    })
  }

  return result
}
