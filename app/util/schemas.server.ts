import { z } from 'zod'

export const ShortenFormData = z.object({
  url: z.string().url(),
})

export const RegisterFormData = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    confirm: z.string(),
  })
  .refine(data => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  })

export const LoginFormData = z.object({
  email: z.string(),
  password: z.string(),
})
