import { calculateTTSCost, logCost } from '@/lib/gemini-config'

export async function POST(req: Request) {
  const { text } = await req.json()

  const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM" // Rachel voice
  const apiKey = process.env.ELEVENLABS_API_KEY

  if (!apiKey) {
    return Response.json({ error: "ElevenLabs API key not configured" }, { status: 500 })
  }

  console.log("\n🔊 [TTS API] Converting text to speech")

  try {
    // Calculate and log cost BEFORE API call
    const cost = calculateTTSCost(text)
    logCost('TTS', cost)
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ [TTS] ElevenLabs API error:", response.status, errorText)
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    // Log response headers for debugging (may contain rate limit info)
    console.log("📊 [TTS] Response headers:", {
      'x-request-id': response.headers.get('x-request-id'),
      'content-type': response.headers.get('content-type'),
      // Note: ElevenLabs doesn't return character count in headers
      // Character billing is tracked on their backend
    })

    // Return audio as base64 for easy handling in frontend
    const audioBuffer = await response.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString("base64")

    return Response.json({ audio: base64Audio })
  } catch (error) {
    console.error("❌ [TTS] Error:", error)
    return Response.json({ error: "Failed to generate speech" }, { status: 500 })
  }
}
