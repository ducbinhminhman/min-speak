export async function GET() {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
  const apiKey = process.env.ELEVENLABS_API_KEY

  if (!apiKey || !agentId) {
    return Response.json(
      { error: "ElevenLabs configuration missing" },
      { status: 500 }
    )
  }

  console.log("\n🔐 [ElevenLabs Auth] Generating signed URL for agent:", agentId)

  try {
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

    const data = await response.json()
    console.log("✅ [ElevenLabs Auth] Signed URL generated successfully")

    return Response.json({ signedUrl: data.signed_url })
  } catch (error: any) {
    console.error("❌ [ElevenLabs Auth] Error:", error.message)
    return Response.json(
      { error: "Failed to generate signed URL" },
      { status: 500 }
    )
  }
}
