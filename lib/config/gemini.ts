/**
 * Gemini AI Configuration
 * Models, prompts, and fallback data
 */

import type { GeminiModelConfig, ConversationAnalysis } from '@/lib/types'

// ============================================================================
// MODEL CONFIGURATIONS
// ============================================================================

export const MODELS = {
  ANALYSIS: {
    name: 'gemini-2.0-flash-exp',
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    responseMimeType: 'application/json',
  } as GeminiModelConfig,
} as const

// ============================================================================
// PROMPT TEMPLATES
// ============================================================================

export const PROMPTS = {
  CONVERSATION_DETAILED_ANALYSIS: `You are an expert English conversation coach analyzing a learner's conversation practice.

Full conversation:
{CONVERSATION}

Analyze the learner's English in detail and provide feedback in the following JSON format:
{
  "sentenceAnalysis": [
    {
      "original": "What the user said",
      "improved": "A more natural way to say it",
      "issues": ["issue 1", "issue 2"],
      "tips": "Specific advice for this sentence"
    }
  ],
  "overallStrengths": ["strength 1", "strength 2", "strength 3"],
  "areasToImprove": [
    {
      "area": "Name of area (e.g., 'Pronunciation', 'Grammar', 'Vocabulary')",
      "explanation": "What to focus on",
      "examples": ["example 1", "example 2"]
    }
  ],
  "vocabularySuggestions": [
    {
      "word": "useful word",
      "meaning": "definition",
      "example": "example sentence",
      "context": "when/why to use it"
    }
  ],
  "summary": "Encouraging overall summary with key takeaways"
}

Guidelines:

1. **Sentence Analysis**: Examine ONLY the user's messages (not the assistant's). For each user message:
   - Show what they said originally
   - Provide a more natural/fluent version
   - List specific issues (grammar errors, awkward phrasing, pronunciation challenges)
   - Give actionable tips for improvement

2. **Overall Strengths**: Identify 3-4 things the learner did well:
   - Good vocabulary choices
   - Correct grammar usage
   - Natural expressions
   - Clear communication

3. **Areas to Improve**: Focus on 2-3 key areas with specific examples from their conversation:
   - Pronunciation patterns they struggle with
   - Grammar structures they need to practice
   - Vocabulary gaps
   - Fluency and naturalness

4. **Vocabulary Suggestions**: Provide 4-5 useful words/phrases that would enhance their expression, with clear context for when to use them.

5. **Summary**: Write an encouraging 3-4 sentence summary that:
   - Acknowledges their effort and progress
   - Highlights their main strengths
   - Points to 1-2 focus areas for next practice
   - Motivates them to continue

Be specific, practical, and encouraging. Help them speak more naturally and confidently.

Return ONLY valid JSON, no markdown formatting or additional text.`,
} as const

// ============================================================================
// FALLBACK DATA
// ============================================================================

export const FALLBACK_ANALYSIS: ConversationAnalysis = {
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
