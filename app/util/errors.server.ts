import type { ZodError } from 'zod'

/**
 * Maps all issues in a `ZodError` to their path and error message
 */
export function parseZodError(error: ZodError) {
  const errors: Record<string, string> = {}

  for (const issue of error.issues) {
    errors[issue.path.join()] = issue.message
  }

  return errors
}
