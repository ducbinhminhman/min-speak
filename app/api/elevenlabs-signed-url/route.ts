import { getSignedUrl } from '@/lib/services/elevenlabs.service'

export async function GET() {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
  const apiKey = process.env.ELEVENLABS_API_KEY

  if (!apiKey || !agentId) {
    return Response.json(
      { error: "ElevenLabs configuration missing" },
      { status: 500 }
    )
  }

  try {
    const signedUrl = await getSignedUrl(agentId, apiKey)
    return Response.json({ signedUrl })
  } catch (error: any) {
    console.error("❌ [ElevenLabs Auth] Error:", error.message)
    return Response.json(
      { error: "Failed to generate signed URL" },
      { status: 500 }
    )
  }
}
