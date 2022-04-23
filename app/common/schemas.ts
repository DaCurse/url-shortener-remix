import { z } from 'zod'

export const ShortenFormData = z.object({
  url: z.string().url(),
})

const MIN_PASSWORD_LENGTH = 6

export const RegisterFormData = z
  .object({
    email: z.string().email(),
    password: z.string().min(MIN_PASSWORD_LENGTH, {
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    }),
    confirm: z.string(),
  })
  .refine(data => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  })

export const LoginFormData = z.object({
  email: z.string(),
  password: z.string(),
  remember: z.any().default(false),
})
