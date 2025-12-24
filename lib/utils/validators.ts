/**
 * Validation Utilities
 */

/**
 * Validate required environment variables
 */
export function validateEnvVars(
  ...vars: Array<{ name: string; value: string | undefined }>
): { valid: boolean; missing?: string } {
  for (const { name, value } of vars) {
    if (!value) {
      return { valid: false, missing: name }
    }
  }
  return { valid: true }
}

/**
 * Validate request body has required fields
 */
export function validateRequestBody<T extends Record<string, unknown>>(
  body: unknown,
  requiredFields: Array<keyof T>
): { valid: boolean; missing?: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, missing: 'body' }
  }

  for (const field of requiredFields) {
    if (!(field in body)) {
      return { valid: false, missing: String(field) }
    }
  }

  return { valid: true }
}
