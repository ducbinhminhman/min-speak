 import { 
  getElevenLabsUsage, 
  formatUsageSummary 
} from '@/lib/elevenlabs-usage'

/**
 * GET /api/usage/elevenlabs
 * Query ElevenLabs usage statistics
 */
export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY

  if (!apiKey) {
    return Response.json(
      { error: 'ElevenLabs API key not configured' },
      { status: 500 }
    )
  }

  try {
    // Get usage for last 30 days
    const usage = await getElevenLabsUsage(apiKey)

    if (!usage) {
      return Response.json(
        { error: 'Failed to fetch usage data' },
        { status: 500 }
      )
    }

    // Log summary to console
    console.log(formatUsageSummary(usage))

    // Return usage data
    return Response.json({
      success: true,
      usage,
      summary: formatUsageSummary(usage)
    })
  } catch (error: any) {
    console.error('❌ [Usage API] Error:', error.message)
    return Response.json(
      { error: 'Failed to fetch usage statistics' },
      { status: 500 }
    )
  }
}
