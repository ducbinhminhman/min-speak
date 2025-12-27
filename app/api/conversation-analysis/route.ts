import { NextRequest } from 'next/server'
import { createErrorResponse } from '@/lib/api/handlers'
import { FALLBACK_FEEDBACK } from '@/lib/config/constants'
import type { ConversationMessage } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { conversationHistory } = await request.json()

    // Validate input
    if (!conversationHistory || !Array.isArray(conversationHistory) || conversationHistory.length === 0) {
      return createErrorResponse('Conversation history is required', 400)
    }

    // Get Vertex AI credentials
    const apiKey = process.env.VERTEX_AI_API_KEY
    const project = process.env.GOOGLE_CLOUD_PROJECT
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'

    if (!apiKey || !project) {
      return createErrorResponse('VERTEX_AI_API_KEY and GOOGLE_CLOUD_PROJECT must be configured', 500)
    }

    // Build conversation transcript
    const transcript = conversationHistory
      .map((msg: ConversationMessage) => `${msg.role}: ${msg.content}`)
      .join('\n')

    // Build prompt using original template
    const prompt = `You are an expert English conversation coach analyzing a learner's conversation practice.

Full conversation:
${transcript}

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

Return ONLY valid JSON, no markdown formatting or additional text.`

    // Call Vertex AI REST API with API key
    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/gemini-2.5-flash:generateContent?key=${apiKey}`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json'
        }
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ [Vertex AI] Error:', error)
      throw new Error(`Vertex AI API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    // Remove markdown code blocks if present
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    // Parse JSON response
    let analysisData
    try {
      analysisData = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error('❌ [Vertex AI] JSON parse failed:', parseError)
      analysisData = FALLBACK_FEEDBACK
    }

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
