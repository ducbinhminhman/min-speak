/**
 * Centralized Gemini AI Configuration
 * Single source of truth for all Gemini API settings, prompts, and model configurations
 */

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
   * Model configuration for conversation analysis
   * Optimized for structured analysis and JSON output
   */
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
} as const

// ============================================================================
// FALLBACK FEEDBACK DATA
// ============================================================================

export const FALLBACK_FEEDBACK = {
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

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format conversation history into a readable transcript
 * @param history - Array of conversation messages with role and content
 * @returns Formatted transcript string
 */
export function formatConversationTranscript(history: Array<{ role: string; content: string }>): string {
  if (!history || history.length === 0) {
    return ''
  }
  
  return history
    .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
    .join("\n")
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


