/**
 * Conversation formatting utilities
 */

import type { ConversationMessage } from '@/lib/types'

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
