/**
 * Array utility functions
 */

/**
 * Get the last item from an array safely
 * @returns The last item or undefined if array is empty
 */
export function getLastItem<T>(array: T[]): T | undefined {
  return array.at(-1)
}

/**
 * Get the last N items from an array
 */
export function getLastN<T>(array: T[], n: number): T[] {
  return array.slice(-n)
}
