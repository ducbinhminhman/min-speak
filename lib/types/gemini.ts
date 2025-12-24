/**
 * Gemini AI type definitions
 */

export interface GeminiModelConfig {
  name: string
  maxOutputTokens: number
  temperature: number
  topP?: number
  topK?: number
  responseMimeType?: string
}

export interface GeminiGenerationConfig {
  maxOutputTokens: number
  temperature: number
  topP?: number
  responseMimeType?: string
}
