/**
 * Text formatting utilities
 */

/**
 * Format conversation history into a readable transcript
 * @param history - Array of conversation messages with role and content
 * @returns Formatted transcript string
 */
export function formatConversationTranscript(
  history: Array<{ role: string; content: string }>
): string {
  if (!history || history.length === 0) {
    return ''
  }
  
  return history
    .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
    .join("\n")
}

/**
 * Clean markdown code blocks from text
 * @param text - Text potentially containing markdown code blocks
 * @returns Cleaned text
 */
export function cleanMarkdownCodeBlocks(text: string): string {
  return text.replace(/```json\n?/g, '').replace(/```\n?/g, '')
}
