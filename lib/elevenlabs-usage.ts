/**
 * ElevenLabs Usage Tracking Utilities
 * For querying actual usage from ElevenLabs API
 */

interface ElevenLabsUsageResponse {
  time: number[]
  usage: {
    [key: string]: number[]
  }
}

/**
 * Get ElevenLabs usage statistics
 * @param apiKey - ElevenLabs API key
 * @param startDate - Start date for usage window
 * @param endDate - End date for usage window
 * @returns Usage statistics
 */
export async function getElevenLabsUsage(
  apiKey: string,
  startDate: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Default: last 30 days
  endDate: Date = new Date()
): Promise<ElevenLabsUsageResponse | null> {
  try {
    const startUnix = startDate.getTime()
    const endUnix = endDate.getTime()

    const response = await fetch(
      `https://api.elevenlabs.io/v1/usage/character-stats?start_unix=${startUnix}&end_unix=${endUnix}`,
      {
        headers: {
          'xi-api-key': apiKey,
        },
      }
    )

    if (!response.ok) {
      console.error('❌ [ElevenLabs Usage] API error:', response.status)
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('❌ [ElevenLabs Usage] Failed to fetch:', error)
    return null
  }
}

/**
 * Calculate total characters used
 * @param usage - Usage response from API
 * @returns Total character count
 */
export function calculateTotalCharacters(usage: ElevenLabsUsageResponse): number {
  if (!usage.usage || !usage.usage.All) {
    return 0
  }

  return usage.usage.All.reduce((sum, count) => sum + count, 0)
}

/**
 * Check if still within free tier
 * @param totalCharacters - Total characters used this month
 * @returns Boolean indicating if still in free tier
 */
export function isWithinElevenLabsFreeTier(totalCharacters: number): boolean {
  const FREE_TIER_LIMIT = 10000 // 10K characters/month
  return totalCharacters < FREE_TIER_LIMIT
}

/**
 * Get remaining free tier characters
 * @param totalCharacters - Total characters used this month
 * @returns Remaining characters in free tier
 */
export function getRemainingFreeCharacters(totalCharacters: number): number {
  const FREE_TIER_LIMIT = 10000
  return Math.max(0, FREE_TIER_LIMIT - totalCharacters)
}

/**
 * Format usage summary for logging
 * @param usage - Usage response from API
 * @returns Formatted summary string
 */
export function formatUsageSummary(usage: ElevenLabsUsageResponse): string {
  const total = calculateTotalCharacters(usage)
  const remaining = getRemainingFreeCharacters(total)
  const isFreeTier = isWithinElevenLabsFreeTier(total)

  return `
📊 ElevenLabs Usage Summary:
  • Total characters used: ${total.toLocaleString()}
  • Free tier remaining: ${remaining.toLocaleString()} / 10,000
  • Status: ${isFreeTier ? '✅ FREE TIER' : '💳 PAID TIER'}
  • Period: Last 30 days
  `
}
