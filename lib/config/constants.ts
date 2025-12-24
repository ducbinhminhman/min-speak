/**
 * Application constants
 */

import type { ConversationAnalysisData } from '@/lib/types'

export const FALLBACK_FEEDBACK: ConversationAnalysisData = {
  sentenceAnalysis: [],
  overallStrengths: [
    "You practiced speaking with AI in real-time",
    "You engaged in natural conversation",
    "You're building confidence through practice"
  ],
  areasToImprove: [{
    area: "Keep practicing",
    explanation: "Continue having conversations to improve fluency and confidence",
    examples: ["Practice daily", "Speak naturally", "Don't worry about mistakes"]
  }],
  vocabularySuggestions: [],
  summary: "Great job completing your conversation! Keep practicing to build fluency and confidence.",
}

export const MIN_MESSAGES_FOR_ANALYSIS = 2
