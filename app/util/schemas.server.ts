import { z } from 'zod'

export const LoginFormData = z.object({
  email: z.string(),
  password: z.string(),
})
