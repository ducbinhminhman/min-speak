/**
 * Conversation formatting utilities
 */

import type { ConversationMessage } from '@/lib/types'

/**
 * Format conversation history into a readable transcript
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
 * Convert messages from agent format to API format
 */
export function convertToApiFormat(
  messages: Array<{ role: "user" | "agent"; content: string; timestamp: Date }>
): ConversationMessage[] {
  return messages.map(msg => ({
    role: msg.role === "agent" ? "assistant" : "user",
    content: msg.content,
    timestamp: msg.timestamp,
  }))
}
