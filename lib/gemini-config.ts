/**
 * Centralized Gemini AI Configuration
 * Single source of truth for all Gemini API settings, prompts, and model configurations
 */

import type { ConversationMessage } from '@/app/page'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface GeminiModelConfig {
  name: string
  maxOutputTokens: number
  temperature: number
  topP?: number
  topK?: number
  responseMimeType?: string
}

export interface CacheConfig {
  enabled: boolean
  ttl: string // e.g., '3600s' for 1 hour
  minHistoryLength: number // Minimum conversation length to enable caching
}

export interface PromptTemplate {
  system: string
  fallback: string
}

export interface CostEstimate {
  inputTokens: number
  outputTokens: number
  inputCost: number
  outputCost: number
  totalCost: number
  currency: string
}

// ============================================================================
// PRICING INFORMATION (Updated December 2024)
// ============================================================================

/**
 * Gemini API Pricing (Free tier & Paid)
 * Source: https://ai.google.dev/pricing
 * 
 * FREE TIER (up to 1,500 requests/day):
 * - Input: FREE
 * - Output: FREE
 * - Rate limit: 15 RPM, 1M TPM, 1,500 RPD
 * 
 * PAID TIER (Pay-as-you-go after free tier):
 * - gemini-2.0-flash-exp: 
 *   - Input: $0.075 per 1M tokens
 *   - Output: $0.30 per 1M tokens
 */
export const PRICING = {
  GEMINI: {
    // Free tier limits
    FREE_TIER: {
      requestsPerDay: 1500,
      requestsPerMinute: 15,
      tokensPerMinute: 1000000,
    },
    
    // Paid pricing (per 1M tokens)
    FLASH: {
      input: 0.075,    // $0.075 per 1M input tokens
      output: 0.30,    // $0.30 per 1M output tokens
    },
    
    // Context caching pricing (90% discount)
    CACHED: {
      input: 0.0075,   // $0.0075 per 1M cached tokens (90% off)
    }
  },
  
  ELEVENLABS: {
    // Free tier: 10,000 characters/month
    FREE_TIER: {
      charactersPerMonth: 10000,
    },
    
    // Paid tier pricing
    STARTER: {
      charactersPerMonth: 30000,
      price: 5, // $5/month
    },
    
    CREATOR: {
      charactersPerMonth: 100000,
      price: 22, // $22/month
    },
    
    // Per-character cost (after free tier)
    perCharacter: 0.00018, // $0.18 per 1K characters
  }
} as const

// ============================================================================
// MODEL CONFIGURATIONS
// ============================================================================

export const MODELS = {
  /**
   * Model configuration for conversation/chat API
   * Optimized for natural, conversational responses
   */
  CONVERSATION: {
    name: 'gemini-2.0-flash-exp',
    maxOutputTokens: 512,
    temperature: 0.8,
    topP: 0.95,
  } as GeminiModelConfig,

  /**
   * Model configuration for feedback analysis
   * Optimized for structured analysis and JSON output
   */
  FEEDBACK: {
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
  /**
   * System prompt for conversation mode
   * This defines the AI's personality and behavior during conversations
   */
  CONVERSATION_SYSTEM: `You are a friendly English conversation partner helping users practice their speaking skills. 
Keep responses natural, conversational, and encouraging. 
Ask follow-up questions to keep the conversation going.
Keep responses concise (2-3 sentences max) so they're easy to listen to.
Occasionally provide gentle corrections or suggest better ways to phrase things.`,

  /**
   * System prompt for reflective chat mode
   * Helps users process their thoughts and feelings about what they shared
   */
  REFLECTIVE_CHAT: `You are a compassionate, neutral listener helping someone process their thoughts and feelings.

Your role:
- Ask open-ended questions to help them explore deeper
- Reflect back what you hear without judgment
- Help them name their own emotions and thoughts
- Stay curious, warm, and non-judgmental
- Don't give advice unless explicitly asked
- Don't impose interpretations or manipulate their feelings
- Keep responses short (2-3 sentences max)
- Focus on helping them understand themselves better

Guidelines:
- Use phrases like: "How did that make you feel?", "Tell me more about...", "What was going through your mind?"
- Reflect back: "It sounds like you felt...", "I hear that..."
- Validate without fixing: "That makes sense", "I can understand why..."
- Stay open and curious, not directive

Remember: Your job is to help them explore, not to solve or judge.`,

  /**
   * Prompt for generating authentic diary entry
   * Uses user's actual words to create diary
   */
  DIARY_AUTHENTIC: `You are helping someone create an authentic diary entry from their day.

Vietnamese spoken:
{VIETNAMESE}

English translation:
{ENGLISH}

Reflective chat conversation:
{CHAT_HISTORY}

Create an authentic diary entry in the following JSON format:
{
  "entry": "The diary entry text in first person, using their actual words and phrases",
  "date": "Today's date in format: December 17, 2025"
}

Guidelines:
1. **Use their ACTUAL words** - copy phrases they used verbatim from Vietnamese, English, and chat
2. **Keep their speaking style** - don't make it fancy or literary
3. **Organize chronologically** - structure what happened during their day
4. **Include emotions** - use feelings they expressed in the chat
5. **First person** - write as "I..." using their voice
6. **Natural tone** - sounds like them writing in their diary, not an essay
7. **Be authentic** - this is THEIR voice, not polished writing

Example style: "Today I went to the market. I felt happy when I met my old friend. We talked about..."

Return ONLY valid JSON, no markdown formatting.`,

  /**
   * Prompt for generating literary diary entry
   * Polished, expressive version of the same day
   */
  DIARY_LITERARY: `You are helping someone create a literary, polished diary entry from their day.

Authentic entry (user's voice):
{AUTHENTIC_ENTRY}

Original context:
Vietnamese: {VIETNAMESE}
English: {ENGLISH}
Chat: {CHAT_HISTORY}

Create a literary diary entry in the following JSON format:
{
  "entry": "A polished, literary diary entry with the same facts and feelings",
  "date": "Today's date in format: December 17, 2025"
}

Guidelines:
1. **Same facts and feelings** - don't invent anything, use what they shared
2. **Literary style** - more expressive, flowing prose
3. **Richer vocabulary** - use more descriptive, evocative words
4. **Better sentence structure** - varied rhythm, engaging flow
5. **Vivid imagery** - paint a picture with words
6. **Emotional depth** - explore feelings more eloquently
7. **Still authentic** - enhanced version, not fiction

Example style: "The morning market bustled with familiar faces and forgotten memories. When I encountered my old friend among the vendor stalls, a warmth spread through my chest..."

Return ONLY valid JSON, no markdown formatting.`,

  /**
   * Analysis prompt for Vietnamese-to-English translation feedback
   * This guides the AI to compare and evaluate translation quality
   */
  TRANSLATION_FEEDBACK: `You are an expert language coach specializing in Vietnamese-to-English translation.

Vietnamese original:
{VIETNAMESE}

English translation (provided by learner):
{ENGLISH}

Analyze the learner's translation and provide feedback in the following JSON format:
{
  "bestVersion": "The ideal English translation of the Vietnamese text - natural, fluent, and accurate",
  "vocabularySuggestions": [
    { "word": "suggested word", "meaning": "definition", "example": "example sentence using this word" },
    { "word": "another word", "meaning": "definition", "example": "example sentence" }
  ],
  "grammarStructures": [
    { "structure": "grammar pattern name", "explanation": "how to use it", "example": "example sentence" },
    { "structure": "another pattern", "explanation": "how to use it", "example": "example sentence" }
  ],
  "summary": "A brief encouraging summary comparing their translation to the best version"
}

Guidelines:
1. **Best Version**: Write the most natural, fluent English translation of the Vietnamese text. This should sound like a native speaker.

2. **Vocabulary Suggestions**: Provide 3-4 useful vocabulary words that:
   - Would improve their translation
   - Are relevant to the topic they discussed
   - Include clear meaning and practical example sentences
   - Help them express similar ideas better in the future

3. **Grammar Structures**: Teach 2-3 sentence structures or grammar patterns that:
   - Would make their English more natural
   - Are relevant to what they were trying to say
   - Include clear explanations of when/how to use them
   - Provide concrete example sentences
   - Examples: "past perfect tense", "conditionals", "passive voice", "relative clauses", etc.

4. **Summary**: 
   - Acknowledge what they did well in their translation
   - Briefly note the main differences from the best version
   - Encourage them to keep practicing (2-3 sentences)

Focus on teaching them to speak more naturally and accurately in English.

Return ONLY valid JSON, no markdown formatting or additional text.`,

  /**
   * Prompt for Vietnamese-only input (AI translates)
   */
  VIETNAMESE_TO_ENGLISH: `You are an expert language coach helping Vietnamese learners improve their English.

The learner spoke in Vietnamese about their day:
{VIETNAMESE}

Translate this to natural English and provide learning feedback in the following JSON format:
{
  "bestVersion": "Natural, fluent English translation of what they said",
  "vocabularySuggestions": [
    { "word": "useful word", "meaning": "definition", "example": "example sentence" }
  ],
  "grammarStructures": [
    { "structure": "grammar pattern", "explanation": "how to use it", "example": "example sentence" }
  ],
  "summary": "Encouraging summary highlighting the topic and what they can learn"
}

Guidelines:
1. **Best Version**: Translate their Vietnamese naturally into English - how a native speaker would say it.

2. **Vocabulary**: Provide 3-4 key vocabulary words from your translation that they should learn.

3. **Grammar Structures**: Teach 2-3 grammar patterns used in the translation that would help them in similar situations.

4. **Summary**: Acknowledge what they talked about and encourage them to practice speaking English next time.

Return ONLY valid JSON, no markdown formatting or additional text.`,

  /**
   * Prompt for English-only input (analyze English)
   */
  ENGLISH_ANALYSIS: `You are an expert English language coach.

The learner spoke in English:
{ENGLISH}

Analyze their English and provide feedback in the following JSON format:
{
  "bestVersion": "A more natural, polished version of what they said in English",
  "vocabularySuggestions": [
    { "word": "better word choice", "meaning": "definition", "example": "example sentence" }
  ],
  "grammarStructures": [
    { "structure": "grammar pattern", "explanation": "how to use it", "example": "example sentence" }
  ],
  "summary": "Encouraging summary of their strengths and areas to improve"
}

Guidelines:
1. **Best Version**: Rewrite their English to sound more natural and fluent, fixing any errors.

2. **Vocabulary**: Suggest 3-4 vocabulary words that would improve their expression.

3. **Grammar Structures**: Teach 2-3 grammar patterns that would help them speak more naturally.

4. **Summary**: Acknowledge what they did well and provide specific encouragement.

Return ONLY valid JSON, no markdown formatting or additional text.`,

  /**
   * Prompt for detailed conversation analysis (sentence-by-sentence)
   * Analyzes each user message and provides specific improvement suggestions
   */
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

  /**
   * Analysis prompt for feedback generation
   * This guides the AI to analyze conversations and generate structured feedback
   */
  FEEDBACK_ANALYSIS: `You are an expert English language coach. Analyze this conversation between a learner and an AI tutor.

Conversation transcript:
{TRANSCRIPT}

Based on this conversation, provide personalized feedback in the following JSON format:
{
  "pronunciationNudges": ["tip 1", "tip 2", "tip 3"],
  "phraseUpgrades": [
    { "original": "phrase user said", "improved": "better alternative" },
    { "original": "another phrase", "improved": "better version" }
  ],
  "summary": "A brief encouraging summary of the conversation and key strengths/areas to improve"
}

Guidelines:
1. **Pronunciation tips**: Infer likely pronunciation challenges from their word choices, hesitations, or patterns. Give 2-3 specific, actionable tips about common sounds or stress patterns they might struggle with.

2. **Phrase upgrades**: Find 2-3 actual phrases the user said and suggest more natural, native-sounding alternatives. Use their exact words for "original".

3. **Summary**: Write an encouraging 2-3 sentence summary highlighting what they discussed, their strengths, and one area to focus on.

If the conversation is too short (less than 2 exchanges), provide general encouraging feedback.

Return ONLY valid JSON, no markdown formatting or additional text.`,

  /**
   * Fallback prompts when AI Studio fetch fails
   */
  FALLBACK: {
    conversation: `You are a friendly English conversation partner helping users practice their speaking skills. 
Keep responses natural, conversational, and encouraging. 
Ask follow-up questions to keep the conversation going.
Keep responses concise (2-3 sentences max) so they're easy to listen to.
Occasionally provide gentle corrections or suggest better ways to phrase things.`,
    
    feedback: `You are an expert English language coach analyzing conversations.
Provide helpful, encouraging feedback with specific pronunciation tips and phrase improvements.
Focus on actionable advice that learners can immediately apply.`,
  },
} as const

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================

export const CACHE_CONFIG: CacheConfig = {
  enabled: true,
  ttl: '3600s', // 1 hour cache duration
  minHistoryLength: 2, // Enable caching after 2+ messages
}

// ============================================================================
// FALLBACK FEEDBACK DATA
// ============================================================================

export const FALLBACK_FEEDBACK = {
  bestVersion: "Unable to generate the best version at this time.",
  vocabularySuggestions: [],
  grammarStructures: [],
  summary: "Nice work on your translation! Keep practicing regularly to build your confidence and fluency.",
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get complete configuration for chat/conversation API
 * @param conversationHistory - Optional conversation history for context
 * @returns Configuration object ready to use with Gemini API
 */
export function getChatConfig(conversationHistory?: ConversationMessage[]) {
  return {
    model: MODELS.CONVERSATION,
    prompt: PROMPTS.CONVERSATION_SYSTEM,
    generationConfig: {
      maxOutputTokens: MODELS.CONVERSATION.maxOutputTokens,
      temperature: MODELS.CONVERSATION.temperature,
      topP: MODELS.CONVERSATION.topP,
    },
    cacheConfig: CACHE_CONFIG,
    shouldUseCache: conversationHistory 
      ? conversationHistory.length >= CACHE_CONFIG.minHistoryLength 
      : false,
  }
}

/**
 * Get complete configuration for feedback API (Translation mode)
 * @param vietnameseText - Original Vietnamese text
 * @param englishTranslation - User's English translation
 * @returns Configuration object ready to use with Gemini API
 */
export function getTranslationFeedbackConfig(vietnameseText: string, englishTranslation: string) {
  const prompt = PROMPTS.TRANSLATION_FEEDBACK
    .replace('{VIETNAMESE}', vietnameseText)
    .replace('{ENGLISH}', englishTranslation)

  return {
    model: MODELS.FEEDBACK,
    prompt,
    generationConfig: {
      maxOutputTokens: MODELS.FEEDBACK.maxOutputTokens,
      temperature: MODELS.FEEDBACK.temperature,
      topP: MODELS.FEEDBACK.topP,
      responseMimeType: MODELS.FEEDBACK.responseMimeType,
    },
    fallbackFeedback: FALLBACK_FEEDBACK,
  }
}

/**
 * Get complete configuration for feedback API
 * @param conversationHistory - Conversation history to analyze
 * @returns Configuration object ready to use with Gemini API
 */
export function getFeedbackConfig(conversationHistory: ConversationMessage[]) {
  const transcript = formatConversationTranscript(conversationHistory)
  const prompt = PROMPTS.FEEDBACK_ANALYSIS.replace('{TRANSCRIPT}', transcript)

  return {
    model: MODELS.FEEDBACK,
    prompt,
    generationConfig: {
      maxOutputTokens: MODELS.FEEDBACK.maxOutputTokens,
      temperature: MODELS.FEEDBACK.temperature,
      topP: MODELS.FEEDBACK.topP,
      responseMimeType: MODELS.FEEDBACK.responseMimeType,
    },
    fallbackFeedback: FALLBACK_FEEDBACK,
  }
}

/**
 * Format conversation history into a readable transcript
 * @param history - Array of conversation messages
 * @returns Formatted transcript string
 */
export function formatConversationTranscript(history: ConversationMessage[]): string {
  if (!history || history.length === 0) {
    return ''
  }
  
  return history
    .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
    .join("\n")
}

/**
 * Build full prompt for conversation with context
 * @param systemPrompt - System instruction prompt
 * @param conversationHistory - Previous conversation messages
 * @param newMessage - New user message
 * @returns Complete prompt string
 */
export function buildConversationPrompt(
  systemPrompt: string,
  conversationHistory: ConversationMessage[] | undefined,
  newMessage: string
): string {
  const conversationContext = conversationHistory ? formatConversationTranscript(conversationHistory) : ''
  
  if (conversationContext) {
    return `${systemPrompt}\n\nPrevious conversation:\n${conversationContext}\n\nUser: ${newMessage}\n\nRespond naturally:`
  }
  
  return `${systemPrompt}\n\nUser: ${newMessage}\n\nRespond naturally:`
}

/**
 * Check if caching should be enabled for current request
 * @param historyLength - Number of messages in conversation history
 * @returns Boolean indicating if cache should be used
 */
export function shouldEnableCache(historyLength: number): boolean {
  return CACHE_CONFIG.enabled && historyLength >= CACHE_CONFIG.minHistoryLength
}

/**
 * Get model name for logging/debugging
 * @param type - Type of API ('conversation' or 'feedback')
 * @returns Model name string
 */
export function getModelName(type: 'conversation' | 'feedback'): string {
  return type === 'conversation' ? MODELS.CONVERSATION.name : MODELS.FEEDBACK.name
}

// ============================================================================
// COST CALCULATION FUNCTIONS
// ============================================================================

/**
 * Estimate cost for text input (rough approximation: 1 token ≈ 4 characters)
 * @param text - Input text
 * @returns Estimated token count
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

/**
 * Calculate Gemini API cost
 * @param inputTokens - Number of input tokens
 * @param outputTokens - Number of output tokens
 * @param usedCache - Whether cached content was used
 * @returns Cost estimate object
 */
export function calculateGeminiCost(
  inputTokens: number, 
  outputTokens: number,
  usedCache: boolean = false
): CostEstimate {
  const inputRate = usedCache ? PRICING.GEMINI.CACHED.input : PRICING.GEMINI.FLASH.input
  const outputRate = PRICING.GEMINI.FLASH.output
  
  const inputCost = (inputTokens / 1_000_000) * inputRate
  const outputCost = (outputTokens / 1_000_000) * outputRate
  
  return {
    inputTokens,
    outputTokens,
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
    currency: 'USD'
  }
}

/**
 * Calculate ElevenLabs TTS cost
 * @param text - Text to convert to speech
 * @returns Cost estimate
 */
export function calculateTTSCost(text: string): {
  characters: number
  cost: number
  currency: string
} {
  const characters = text.length
  const cost = (characters / 1000) * PRICING.ELEVENLABS.perCharacter
  
  return {
    characters,
    cost,
    currency: 'USD'
  }
}

/**
 * Log cost information to console
 * @param apiName - Name of the API (e.g., 'Chat', 'Feedback', 'TTS')
 * @param cost - Cost estimate object
 */
export function logCost(apiName: string, cost: CostEstimate | ReturnType<typeof calculateTTSCost>) {
  if ('totalCost' in cost) {
    // Gemini cost
    console.log(`💰 [${apiName}] Cost Estimate:`, {
      input: `${cost.inputTokens} tokens → $${cost.inputCost.toFixed(6)}`,
      output: `${cost.outputTokens} tokens → $${cost.outputCost.toFixed(6)}`,
      total: `$${cost.totalCost.toFixed(6)}`,
      note: cost.totalCost === 0 ? '✅ FREE TIER' : '💳 PAID'
    })
  } else {
    // TTS cost
    console.log(`💰 [${apiName}] Cost Estimate:`, {
      characters: cost.characters,
      cost: `$${cost.cost.toFixed(6)}`,
      note: cost.cost === 0 ? '✅ FREE TIER' : '💳 PAID'
    })
  }
}

/**
 * Check if user is within free tier limits
 * @param requestCount - Number of requests made today
 * @returns Boolean indicating if still in free tier
 */
export function isWithinFreeTier(requestCount: number): boolean {
  return requestCount < PRICING.GEMINI.FREE_TIER.requestsPerDay
}
