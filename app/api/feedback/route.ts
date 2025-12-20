import { GoogleGenAI } from '@google/genai'
import { 
  getTranslationFeedbackConfig,
  estimateTokens,
  calculateGeminiCost,
  logCost,
  PROMPTS,
  MODELS,
  FALLBACK_FEEDBACK
} from '@/lib/gemini-config'

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export async function POST(req: Request) {
  const { conversationHistory } = await req.json()
  
  console.log("\n📊 [Feedback API] Analyzing input:", {
    messageCount: conversationHistory?.length || 0
  })

  // Validate API key
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: "API key not configured" },
      { status: 500 }
    )
  }

  // Extract Vietnamese and English from conversation history
  const vietnameseText = conversationHistory[0]?.content?.trim() || ""
  const englishTranslation = conversationHistory[1]?.content?.trim() || ""

  // Determine which prompt to use based on what user provided
  let prompt: string
  let analysisType: string

  if (vietnameseText && englishTranslation) {
    // Case 1: Both provided - compare translation
    analysisType = "Translation Comparison"
    prompt = PROMPTS.TRANSLATION_FEEDBACK
      .replace('{VIETNAMESE}', vietnameseText)
      .replace('{ENGLISH}', englishTranslation)
  } else if (vietnameseText && !englishTranslation) {
    // Case 2: Vietnamese only - AI translates
    analysisType = "Vietnamese Translation"
    prompt = PROMPTS.VIETNAMESE_TO_ENGLISH
      .replace('{VIETNAMESE}', vietnameseText)
  } else if (!vietnameseText && englishTranslation) {
    // Case 3: English only - analyze English
    analysisType = "English Analysis"
    prompt = PROMPTS.ENGLISH_ANALYSIS
      .replace('{ENGLISH}', englishTranslation)
  } else {
    // Case 4: Nothing provided
    console.log("⚠️ [Feedback] No content provided")
    return Response.json({
      bestVersion: "Please speak in Vietnamese or English to get feedback!",
      vocabularySuggestions: [],
      grammarStructures: [],
      summary: "Start by speaking about your day in either Vietnamese or English, then we can help you learn."
    })
  }

  console.log(`🎯 [Feedback] Analysis type: ${analysisType}`)

  const config = {
    model: MODELS.FEEDBACK,
    prompt,
    generationConfig: {
      maxOutputTokens: MODELS.FEEDBACK.maxOutputTokens,
      temperature: MODELS.FEEDBACK.temperature,
      topP: MODELS.FEEDBACK.topP,
      responseMimeType: MODELS.FEEDBACK.responseMimeType,
    },
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    
    // Calculate estimated cost
    const inputTokens = estimateTokens(config.prompt)
    
    const response = await ai.models.generateContent({
      model: config.model.name,
      contents: config.prompt,
      config: config.generationConfig
    })
    
    let aiText = response.text
    
    if (!aiText && response.candidates && response.candidates.length > 0) {
      const firstCandidate = response.candidates[0]
      if (firstCandidate.content?.parts?.[0]?.text) {
        aiText = firstCandidate.content.parts[0].text
      }
    }
    
    // Parse JSON response
    let feedbackData
    try {
      const cleanJson = aiText?.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      feedbackData = JSON.parse(cleanJson || '{}')
      
      // Calculate and log cost
      const outputTokens = estimateTokens(aiText || '')
      const cost = calculateGeminiCost(inputTokens, outputTokens)
      logCost('Feedback', cost)
    } catch (parseError) {
      console.error("❌ [Feedback] Parse error")
      feedbackData = FALLBACK_FEEDBACK
    }

    return Response.json(feedbackData)
    
  } catch (error: any) {
    console.error("❌ [Feedback] Error:", error.message)
    return Response.json(FALLBACK_FEEDBACK)
  }
}

