/**
 * Gemini API Service
 * Handles all Gemini AI API interactions
 */

import { GoogleGenAI } from '@google/genai'
import type { ConversationMessage, ConversationAnalysis } from '@/lib/types'
import { MODELS, PROMPTS, FALLBACK_ANALYSIS } from '@/lib/config/gemini'
import { formatConversationTranscript } from './conversation.service'

/**
 * Analyze conversation and provide detailed feedback
 */
export async function analyzeConversation(
  conversationHistory: ConversationMessage[],
  apiKey: string
): Promise<ConversationAnalysis> {
  const conversationText = formatConversationTranscript(conversationHistory)
  const prompt = PROMPTS.CONVERSATION_DETAILED_ANALYSIS.replace(
    '{CONVERSATION}',
    conversationText
  )

  const ai = new GoogleGenAI({ apiKey })

  try {
    const result = await ai.models.generateContent({
      model: MODELS.ANALYSIS.name,
      contents: prompt,
      config: {
        maxOutputTokens: 2048,
        temperature: MODELS.ANALYSIS.temperature,
        topP: MODELS.ANALYSIS.topP,
        responseMimeType: 'application/json',
      },
    })

    const text = result.text || ''
    
    // Remove markdown code blocks if present
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    return JSON.parse(cleanedText)
  } catch (error) {
    console.error('❌ [Gemini Service] Analysis failed:', error)
    throw error
  }
}
