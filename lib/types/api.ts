/**
 * API-related type definitions
 */

export interface ApiError {
  error: string
  status?: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
