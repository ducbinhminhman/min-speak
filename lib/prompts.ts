/**
 * Prompt Management - Fetch prompts from Google AI Studio
 * Prompts are cached for 5 minutes to reduce API calls
 */

interface PromptCache {
  prompt: string
  timestamp: number
  version?: string
}

const promptCache: Map<string, PromptCache> = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Fetch prompt from Google AI Studio API
 */
export async function fetchPromptFromAIStudio(promptId: string, apiKey: string): Promise<string> {
  console.log("🔍 [Prompts] Fetching from AI Studio:", { promptId })
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${promptId}`,
      {
        method: 'GET',
        headers: {
          'x-goog-api-key': apiKey,
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ [Prompts] AI Studio API error:", {
        status: response.status,
        error: errorText
      })
      throw new Error(`Failed to fetch prompt: ${response.status}`)
    }

    const data = await response.json()
    console.log("✅ [Prompts] Fetched successfully:", {
      hasPrompt: !!data.prompt,
      version: data.version
    })

    // Extract prompt text from response
    // Structure: { prompt: { text: "..." } } or { prompt: { parts: [...] } }
    let promptText = ''
    
    if (data.prompt?.text) {
      promptText = data.prompt.text
    } else if (data.prompt?.parts && Array.isArray(data.prompt.parts)) {
      promptText = data.prompt.parts
        .map((part: any) => part.text)
        .filter(Boolean)
        .join('\n')
    }

    return promptText
  } catch (error) {
    console.error("❌ [Prompts] Error fetching prompt:", error)
    throw error
  }
}

/**
 * Get prompt with caching (5 minutes cache)
 */
export async function getPrompt(promptId: string, apiKey: string): Promise<string> {
  const cached = promptCache.get(promptId)
  const now = Date.now()

  // Return cached if still valid
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    console.log("📦 [Prompts] Using cached prompt:", {
      age: Math.round((now - cached.timestamp) / 1000) + 's',
      version: cached.version
    })
    return cached.prompt
  }

  // Fetch new prompt
  console.log("🔄 [Prompts] Cache miss or expired, fetching fresh...")
  const promptText = await fetchPromptFromAIStudio(promptId, apiKey)

  // Cache it
  promptCache.set(promptId, {
    prompt: promptText,
    timestamp: now
  })

  return promptText
}

/**
 * Clear prompt cache (useful for testing or manual refresh)
 */
export function clearPromptCache(promptId?: string) {
  if (promptId) {
    promptCache.delete(promptId)
    console.log("🗑️ [Prompts] Cleared cache for:", promptId)
  } else {
    promptCache.clear()
    console.log("🗑️ [Prompts] Cleared all prompt cache")
  }
}

/**
 * Get default fallback prompt (if API fails)
 */
export function getDefaultPrompt(): string {
  return `You are a friendly English conversation partner helping users practice their speaking skills. 
Keep responses natural, conversational, and encouraging. 
Ask follow-up questions to keep the conversation going.
Keep responses concise (2-3 sentences max) so they're easy to listen to.
Occasionally provide gentle corrections or suggest better ways to phrase things.`
}
