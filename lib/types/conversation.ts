/**
 * Conversation-related type definitions
 */

export interface Message {
  role: "user" | "agent"
  content: string
  timestamp: Date
}

export interface ConversationMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface SentenceAnalysis {
  original: string
  improved: string
  issues: string[]
  tips: string
}

export interface AreaToImprove {
  area: string
  explanation: string
  examples: string[]
}

export interface VocabSuggestion {
  word: string
  meaning: string
  example: string
  context: string
}

export interface ConversationAnalysis {
  sentenceAnalysis: SentenceAnalysis[]
  overallStrengths: string[]
  areasToImprove: AreaToImprove[]
  vocabularySuggestions: VocabSuggestion[]
  summary: string
}
