import { GoogleGenAI } from '@google/genai'
import { getPrompt } from '@/lib/prompts'
import { 
  getChatConfig, 
  buildConversationPrompt,
  estimateTokens,
  calculateGeminiCost,
  logCost,
  PROMPTS
} from '@/lib/gemini-config'

export async function POST(req: Request) {
  const { message, history, mode, context } = await req.json()
  
  console.log("\n💬 [Chat API] Request received:", {
    historyLength: history?.length || 0,
    mode: mode || 'conversation',
    hasContext: !!context
  })

  // Validate API key
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return Response.json(
      { response: "API key not configured. Please check environment variables." },
      { status: 500 }
    )
  }

  // Get centralized configuration
  const config = getChatConfig(history)

  // Fetch system prompt from AI Studio (with fallback to config)
  let systemPrompt: string
  const promptId = process.env.GEMINI_PROMPT_ID
  
  // Use reflective mode if specified
  if (mode === 'reflective') {
    systemPrompt = `${PROMPTS.REFLECTIVE_CHAT}\n\nContext: The user previously shared about their day:\nVietnamese: ${context?.vietnameseText || 'N/A'}\nEnglish: ${context?.englishText || 'N/A'}\n\nNow they want to reflect on this experience with you.`
    console.log("🔮 [Chat] Using reflective mode")
  } else if (promptId) {
    try {
      systemPrompt = await getPrompt(promptId, apiKey)
      console.log("✅ [Prompts] Loaded from AI Studio")
    } catch (error) {
      console.warn("⚠️ [Prompts] Using config default")
      systemPrompt = config.prompt
    }
  } else {
    systemPrompt = config.prompt
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    
    // Build prompt using helper function
    const fullPrompt = buildConversationPrompt(systemPrompt, history, message)
    
    // Calculate estimated cost
    const inputTokens = estimateTokens(fullPrompt)
    
    const response = await ai.models.generateContent({
      model: config.model.name,
      contents: fullPrompt,
      config: config.generationConfig
    })
    
    // Extract text from response
    let aiText = response.text
    
    if (!aiText && response.candidates && response.candidates.length > 0) {
      const firstCandidate = response.candidates[0]
      
      if (firstCandidate.content) {
        if (firstCandidate.content.parts && firstCandidate.content.parts.length > 0) {
          aiText = firstCandidate.content.parts[0].text
        } else if (typeof firstCandidate.content === 'string') {
          aiText = firstCandidate.content
        } else if ((firstCandidate.content as any).text) {
          aiText = (firstCandidate.content as any).text
        }
      }
      
      if (firstCandidate.finishReason === 'MAX_TOKENS') {
        console.warn("⚠️ [Chat] Response truncated: MAX_TOKENS")
      }
    }
    
    // Calculate and log cost
    const outputTokens = estimateTokens(aiText || '')
    const cost = calculateGeminiCost(inputTokens, outputTokens, config.shouldUseCache)
    logCost('Chat', cost)
    
    return Response.json({ response: aiText || "I'm having trouble responding right now." })
  } catch (error: any) {
    console.error("❌ [Chat] Error:", error.message)
    
    if (error.status === 403) {
      return Response.json(
        { response: "Authentication failed. Please check your API key." },
        { status: 403 }
      )
    }
    
    if (error.status === 429) {
      return Response.json(
        { response: "Rate limit exceeded. Please try again in a moment." },
        { status: 429 }
      )
    }

    return Response.json(
      { response: "I'm having trouble responding right now. Could you try again?" },
      { status: 500 }
    )
  }
}