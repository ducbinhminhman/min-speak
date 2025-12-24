/**
 * API Error Handling Utilities
 */

import { NextResponse } from 'next/server'
import type { ApiError } from '@/lib/types'
import { validateEnvVars, validateRequestBody } from '@/lib/utils/validators'

/**
 * Create standardized error response
 */
export function createErrorResponse(
  message: string,
  status: number = 500
): NextResponse<ApiError> {
  return NextResponse.json(
    { error: message },
    { status }
  )
}

// Re-export validators for backwards compatibility
export { validateEnvVars, validateRequestBody }
