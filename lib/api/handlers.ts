/**
 * API Error Handlers
 * Shared utilities for API routes
 */

import { NextResponse } from 'next/server'

/**
 * Validate API key exists
 */
export function validateApiKey(apiKey: string | undefined, keyName: string): boolean {
  if (!apiKey) {
    console.error(`❌ [API] ${keyName} not found`)
    return false
  }
  return true
}

/**
 * Create error response
 */
export function createErrorResponse(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status })
}

/**
 * Create success response
 */
export function createSuccessResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status })
}

/**
 * Handle API errors with fallback
 */
export function handleApiError<T>(
  error: unknown,
  context: string,
  fallbackData?: T
): NextResponse {
  console.error(`❌ [${context}] Error:`, error)
  
  if (fallbackData) {
    return NextResponse.json(fallbackData, { status: 200 })
  }
  
  return createErrorResponse(`Failed to process ${context.toLowerCase()}`, 500)
}
