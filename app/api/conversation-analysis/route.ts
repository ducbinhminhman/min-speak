import { NextRequest } from 'next/server'
import { analyzeConversation } from '@/lib/services/gemini.service'
import { validateApiKey, createErrorResponse, handleApiError } from '@/lib/api/handlers'
import { FALLBACK_FEEDBACK, MIN_MESSAGES_FOR_ANALYSIS } from '@/lib/config/constants'
import type { ConversationMessage } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { conversationHistory } = await request.json()

    // Validate input
    if (!conversationHistory || !Array.isArray(conversationHistory) || conversationHistory.length === 0) {
      return createErrorResponse('Conversation history is required', 400)
    }

    // Validate API key
    const apiKey = process.env.GEMINI_API_KEY
    if (!validateApiKey(apiKey, 'GEMINI_API_KEY')) {
      return createErrorResponse('API key not configured', 500)
    }

    console.log('🎯 [Conversation Analysis] Starting analysis...')
    console.log('📊 [Conversation Analysis] Messages:', conversationHistory.length)

    // Analyze conversation
    const analysisData = await analyzeConversation(conversationHistory, apiKey!)

    return Response.json(analysisData)

  } catch (error) {
    console.error('❌ [Conversation Analysis] Error:', error)
    
    // Return fallback analysis on any error
    return Response.json({
      ...FALLBACK_FEEDBACK,
      overallStrengths: [
        "You practiced speaking English",
        "You engaged in conversation",
        "You're building confidence"
      ],
      summary: "Keep practicing! Every conversation helps you improve."
    })
  }
}
