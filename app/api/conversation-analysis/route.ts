import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { 
  MODELS, 
  PROMPTS, 
  formatConversationTranscript,
  calculateGeminiCost,
  estimateTokens,
  logCost
} from '@/lib/gemini-config'

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export async function POST(request: NextRequest) {
  try {
    const { conversationHistory } = await request.json()

    if (!conversationHistory || !Array.isArray(conversationHistory) || conversationHistory.length === 0) {
      return NextResponse.json(
        { error: 'Conversation history is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('❌ [Conversation Analysis] GEMINI_API_KEY not found')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    console.log('🎯 [Conversation Analysis] Starting detailed analysis...')
    console.log('📊 [Conversation Analysis] Messages to analyze:', conversationHistory.length)

    // Format conversation for analysis
    const conversationText = formatConversationTranscript(conversationHistory)
    
    // Build prompt
    const prompt = PROMPTS.CONVERSATION_DETAILED_ANALYSIS.replace(
      '{CONVERSATION}',
      conversationText
    )

    // Log prompt preview
    console.log('📝 [Conversation Analysis] Prompt preview:', prompt.substring(0, 200) + '...')

    // Initialize Gemini
    const ai = new GoogleGenAI({ apiKey })

    // Estimate cost
    const inputTokens = estimateTokens(prompt)
    const outputTokens = 2048 // max expected
    const cost = calculateGeminiCost(inputTokens, outputTokens, false)
    logCost('Conversation Analysis', cost)

    // Generate analysis
    console.log('🤖 [Conversation Analysis] Calling Gemini API...')
    const result = await ai.models.generateContent({
      model: MODELS.ANALYSIS.name,
      contents: prompt,
      config: {
        maxOutputTokens: 2048, // Larger output for detailed analysis
        temperature: MODELS.ANALYSIS.temperature,
        topP: MODELS.ANALYSIS.topP,
        responseMimeType: 'application/json',
      },
    })
    
    const text = result.text || ''

    console.log('✅ [Conversation Analysis] Received response:', text.substring(0, 200) + '...')

    // Parse JSON response
    let analysisData
    try {
      // Remove markdown code blocks if present
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      analysisData = JSON.parse(cleanedText)
      
      console.log('✅ [Conversation Analysis] Parsed analysis:', {
        sentenceCount: analysisData.sentenceAnalysis?.length || 0,
        strengthsCount: analysisData.overallStrengths?.length || 0,
        areasCount: analysisData.areasToImprove?.length || 0,
        vocabCount: analysisData.vocabularySuggestions?.length || 0,
      })
    } catch (parseError) {
      console.error('❌ [Conversation Analysis] Failed to parse JSON:', parseError)
      console.error('Raw response:', text)
      
      // Return fallback analysis
      return NextResponse.json({
        sentenceAnalysis: [],
        overallStrengths: [
          "You practiced speaking English",
          "You engaged in conversation",
          "You're building confidence"
        ],
        areasToImprove: [
          {
            area: "Continue practicing",
            explanation: "Keep having conversations to improve fluency",
            examples: ["Practice daily", "Speak with confidence"]
          }
        ],
        vocabularySuggestions: [],
        summary: "Great job practicing! Keep having conversations to build your skills and confidence."
      })
    }

    return NextResponse.json(analysisData)

  } catch (error) {
    console.error('❌ [Conversation Analysis] Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate analysis',
        sentenceAnalysis: [],
        overallStrengths: ["You practiced speaking"],
        areasToImprove: [],
        vocabularySuggestions: [],
        summary: "Keep practicing! Every conversation helps you improve."
      },
      { status: 500 }
    )
  }
}
