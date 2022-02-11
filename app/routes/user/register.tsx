import { Box, Button, TextField, Typography } from '@mui/material'
import { ActionFunction, Form, json, MetaFunction, useActionData } from 'remix'
import { z } from 'zod'
import Link from '~/components/Link'
import { parseZodError } from '~/util/errors.server'

const FormDataSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    confirm: z.string(),
  })
  .refine(data => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  })

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const result = FormDataSchema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return json({ errors: parseZodError(result.error) }, { status: 400 })
  }

  return null
}

export const meta: MetaFunction = () => {
  return {
    title: 'URL Shortener - Register',
  }
}

export default function Register() {
  const actionData = useActionData()
  return (
    <Box component="section" justifyContent="center">
      <header>
        <Typography component="h2" variant="h5">
          Sign up
        </Typography>
      </header>
      <Typography>
        <Link to="/shorten">← Go back</Link>
      </Typography>
      <Form method="post">
        <TextField
          margin="normal"
          required
          fullWidth
          error={actionData?.errors?.email}
          helperText={actionData?.errors?.email}
          type="email"
          name="email"
          label="Email Address"
          autoComplete="email"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          error={actionData?.errors?.password}
          helperText={actionData?.errors?.password}
          name="password"
          label="Password"
          type="password"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          error={actionData?.errors?.confirm}
          helperText={actionData?.errors?.confirm}
          name="confirm"
          label="Confirm Password"
          type="password"
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Link to="/user/login" variant="body2">
          Already have an account? Sign In
        </Link>
      </Form>
    </Box>
  )
}
