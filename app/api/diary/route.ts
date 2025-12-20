import { GoogleGenAI } from '@google/genai'
import { 
  PROMPTS,
  MODELS,
  estimateTokens,
  calculateGeminiCost,
  logCost
} from '@/lib/gemini-config'

interface ChatMessage {
  role: string
  content: string
}

export async function POST(req: Request) {
  const { vietnameseText, englishText, chatHistory } = await req.json()
  
  console.log("\n📔 [Diary API] Generating diary entries:", {
    hasVietnamese: !!vietnameseText,
    hasEnglish: !!englishText,
    chatLength: chatHistory?.length || 0
  })

  // Validate API key
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: "API key not configured" },
      { status: 500 }
    )
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    
    // Format chat history for prompts
    const chatHistoryText = chatHistory
      ?.map((msg: ChatMessage) => `${msg.role === 'user' ? 'Me' : 'Listener'}: ${msg.content}`)
      .join('\n') || 'No chat conversation'
    
    // Generate authentic version first
    const authenticPrompt = PROMPTS.DIARY_AUTHENTIC
      .replace('{VIETNAMESE}', vietnameseText || 'Not provided')
      .replace('{ENGLISH}', englishText || 'Not provided')
      .replace('{CHAT_HISTORY}', chatHistoryText)
    
    console.log("📝 [Diary] Generating authentic version...")
    
    const inputTokens1 = estimateTokens(authenticPrompt)
    
    const authenticResponse = await ai.models.generateContent({
      model: MODELS.FEEDBACK.name,
      contents: authenticPrompt,
      config: {
        maxOutputTokens: 1024,
        temperature: 0.7,
        topP: 0.9,
        responseMimeType: 'application/json',
      }
    })
    
    let authenticText = authenticResponse.text
    if (!authenticText && authenticResponse.candidates?.[0]?.content?.parts?.[0]?.text) {
      authenticText = authenticResponse.candidates[0].content.parts[0].text
    }
    
    const cleanAuthenticJson = authenticText?.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const authenticData = JSON.parse(cleanAuthenticJson || '{}')
    
    const outputTokens1 = estimateTokens(authenticText || '')
    const cost1 = calculateGeminiCost(inputTokens1, outputTokens1)
    logCost('Diary-Authentic', cost1)
    
    // Generate literary version using authentic version as base
    console.log("✨ [Diary] Generating literary version...")
    
    const literaryPrompt = PROMPTS.DIARY_LITERARY
      .replace('{AUTHENTIC_ENTRY}', authenticData.entry || '')
      .replace('{VIETNAMESE}', vietnameseText || 'Not provided')
      .replace('{ENGLISH}', englishText || 'Not provided')
      .replace('{CHAT_HISTORY}', chatHistoryText)
    
    const inputTokens2 = estimateTokens(literaryPrompt)
    
    const literaryResponse = await ai.models.generateContent({
      model: MODELS.FEEDBACK.name,
      contents: literaryPrompt,
      config: {
        maxOutputTokens: 1024,
        temperature: 0.8,
        topP: 0.95,
        responseMimeType: 'application/json',
      }
    })
    
    let literaryText = literaryResponse.text
    if (!literaryText && literaryResponse.candidates?.[0]?.content?.parts?.[0]?.text) {
      literaryText = literaryResponse.candidates[0].content.parts[0].text
    }
    
    const cleanLiteraryJson = literaryText?.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const literaryData = JSON.parse(cleanLiteraryJson || '{}')
    
    const outputTokens2 = estimateTokens(literaryText || '')
    const cost2 = calculateGeminiCost(inputTokens2, outputTokens2)
    logCost('Diary-Literary', cost2)
    
    // Get current date
    const now = new Date()
    const formattedDate = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    const formattedTime = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    })
    
    console.log("✅ [Diary] Both versions generated successfully")
    
    return Response.json({
      authenticVersion: authenticData.entry || "Today was a day worth remembering.",
      literaryVersion: literaryData.entry || "Today was a day worth remembering.",
      date: formattedDate,
      time: formattedTime
    })
    
  } catch (error: any) {
    console.error("❌ [Diary] Error:", error.message)
    
    // Fallback
    const now = new Date()
    const formattedDate = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    const formattedTime = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    })
    
    return Response.json({
      authenticVersion: "Today I practiced speaking and reflecting on my day.",
      literaryVersion: "Today marked another step in my journey of language and self-discovery.",
      date: formattedDate,
      time: formattedTime
    })
  }
}
