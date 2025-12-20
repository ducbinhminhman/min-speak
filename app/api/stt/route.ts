export async function POST(req: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY
  
  console.log("\n🎤 [STT API] Received transcription request")
  
  if (!apiKey) {
    console.error("❌ [STT API] API key not configured")
    return Response.json(
      { error: "API key not configured. Please check environment variables." },
      { status: 500 }
    )
  }

  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File
    const language = formData.get('language') as string || 'en'
    
    if (!audioFile) {
      console.error("❌ [STT API] No audio file in request")
      return Response.json({ error: "No audio file provided" }, { status: 400 })
    }

    console.log("📁 [STT API] Audio file details:", {
      size: audioFile.size,
      type: audioFile.type,
      name: audioFile.name,
      language: language,
      sizeInMB: (audioFile.size / 1024 / 1024).toFixed(2) + " MB"
    })

    // Convert File to Buffer for ElevenLabs
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Create FormData for ElevenLabs with proper file field name
    const elevenLabsFormData = new FormData()
    const blob = new Blob([buffer], { type: audioFile.type })
    elevenLabsFormData.append('file', blob, audioFile.name) // Use 'file' not 'audio'
    elevenLabsFormData.append('model_id', 'scribe_v1')
    elevenLabsFormData.append('language_code', language)

    console.log("🚀 [STT API] Calling ElevenLabs STT API...")

    // Call ElevenLabs STT API
    const response = await fetch(
      'https://api.elevenlabs.io/v1/speech-to-text',
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          // Don't set Content-Type, let FormData handle it
        },
        body: elevenLabsFormData,
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ [STT API] ElevenLabs error:", {
        status: response.status,
        error: errorText
      })
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("✅ [STT API] Transcription successful:", {
      textLength: data.text?.length,
      text: data.text,
      language: data.language_code
    })

    return Response.json({ 
      transcript: data.text,
      language: data.language_code 
    })
  } catch (error: any) {
    console.error("❌ [STT API] Error occurred:", {
      name: error.name,
      message: error.message,
      stack: error.stack?.substring(0, 200)
    })
    return Response.json(
      { error: "Transcription failed. Please try again." },
      { status: 500 }
    )
  }
}
