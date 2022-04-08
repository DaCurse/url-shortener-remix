import { Alert, Box, Button, TextField, Typography } from '@mui/material'
import { useEffect, useRef } from 'react'
import type { ActionFunction, LoaderFunction, MetaFunction } from 'remix'
import { Form, json, redirect, useActionData } from 'remix'
import { parseZodError } from '~/common/errors.server'
import HttpStatus from '~/common/http-status.server'
import { RegisterFormData } from '~/common/schemas.server'
import Link from '~/components/Link'
import { createUser, doesUserExist } from '~/services/user.service'
import { getSession } from '~/session.server'

type ActionData = { success?: true; errors?: Record<string, string> }

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))

  if (session.has('userId')) {
    return redirect('/')
  }

  return json(null)
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const result = RegisterFormData.safeParse(Object.fromEntries(formData))
  if (!result.success) {
    return json<ActionData>(
      { errors: parseZodError(result.error) },
      { status: HttpStatus.BAD_REQUEST }
    )
  }

  const { email, password } = result.data
  if (await doesUserExist(email)) {
    return json<ActionData>(
      { errors: { email: 'A User with that email already exists' } },
      { status: HttpStatus.CONFLICT }
    )
  }
  await createUser(email, password)

  return json<ActionData>({ success: true })
}

export const meta: MetaFunction = () => {
  return {
    title: 'URL Shortener - Register',
  }
}

export default function Register() {
  const actionData = useActionData<ActionData>()

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus()
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus()
    } else if (actionData?.errors?.confirm) {
      confirmRef.current?.focus()
    }
  }, [actionData?.errors])

  return (
    <Box component="section" justifyContent="center">
      <header>
        <Typography component="h2" variant="h5">
          Register
        </Typography>
      </header>
      <Typography>
        <Link to="/">← Go back</Link>
      </Typography>
      <Form method="post">
        <TextField
          inputRef={emailRef}
          margin="normal"
          required
          fullWidth
          error={!!actionData?.errors?.email}
          helperText={actionData?.errors?.email}
          type="email"
          name="email"
          label="Email Address"
          autoComplete="email"
          autoFocus
        />
        <TextField
          inputRef={passwordRef}
          margin="normal"
          required
          fullWidth
          error={!!actionData?.errors?.password}
          helperText={actionData?.errors?.password}
          name="password"
          label="Password"
          type="password"
        />
        <TextField
          inputRef={confirmRef}
          margin="normal"
          required
          fullWidth
          error={!!actionData?.errors?.confirm}
          helperText={actionData?.errors?.confirm}
          name="confirm"
          label="Confirm Password"
          type="password"
        />
        {actionData?.success && (
          <Alert sx={{ mt: 1 }} severity="success">
            Account successfully created, <Link to="/login">login</Link>.
          </Alert>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>

        <Link to="/login" variant="body2">
          Already have an account? Sign In
        </Link>
      </Form>
    </Box>
  )
}
