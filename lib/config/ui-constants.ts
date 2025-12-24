/**
 * UI Animation and Timing Constants
 */

export const ANIMATION = {
  // Loading screen animation duration
  LOADING_SPINNER_DURATION: '1.5s',
  
  // Bounce animation delays for loading dots
  BOUNCE_DELAYS: {
    FIRST: '0ms',
    SECOND: '150ms',
    THIRD: '300ms',
  },
  
  // ElevenLabs disconnect workaround
  // Need small delay to allow server-side disconnect event to propagate
  SESSION_END_DELAY_MS: 100,
} as const

export const TIMINGS = {
  // Typical analysis duration shown to users
  EXPECTED_ANALYSIS_SECONDS: '10-15',
} as const
