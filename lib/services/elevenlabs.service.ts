/**
 * ElevenLabs API Service
 */

interface SignedUrlResponse {
  signed_url: string
}

/**
 * Generate a signed URL for ElevenLabs Conversational AI
 */
export async function getSignedUrl(
  agentId: string,
  apiKey: string
): Promise<string> {
  console.log("\n🔐 [ElevenLabs Auth] Generating signed URL for agent:", agentId)

  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
    {
      headers: {
        "xi-api-key": apiKey,
      },
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    console.error("❌ [ElevenLabs Auth] Failed:", response.status, errorText)
    throw new Error(`Failed to get signed URL: ${response.status}`)
  }

  const data = await response.json() as SignedUrlResponse
  console.log("✅ [ElevenLabs Auth] Signed URL generated successfully")

  return data.signed_url
}
