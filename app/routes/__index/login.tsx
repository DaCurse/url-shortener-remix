import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import HttpStatus from '~/common/http-status.server'
import { LoginFormData } from '~/common/schemas.server'
import Link from '~/components/Link'
import { loginUser } from '~/models/user.service'
import { commitSession, getSession } from '~/session.server'

type ActionData = { error?: string }

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))

  if (session.has('userId')) {
    return redirect('/')
  }

  return json(null)
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))
  const formData = await request.formData()

  try {
    const { email, password, remember } = LoginFormData.parse(
      Object.fromEntries(formData)
    )
    const user = await loginUser(email, password)

    session.set('userId', user.id)

    return redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session, {
          maxAge: remember ? 604_800 : 3600,
        }),
      },
    })
  } catch {
    return json<ActionData>(
      { error: 'Invalid email or password' },
      {
        status: HttpStatus.UNAUTHORIZED,
      }
    )
  }
}

export const meta: MetaFunction = () => {
  return {
    title: 'URL Shortener - Login',
  }
}

export default function Login() {
  const actionData = useActionData()

  return (
    <Box component="section" justifyContent="center">
      <header>
        <Typography component="h2" variant="h5">
          Login
        </Typography>
      </header>
      <Typography>
        <Link to="/">← Go back</Link>
      </Typography>
      <Form method="post">
        <TextField
          margin="normal"
          required
          fullWidth
          error={!!actionData?.error}
          helperText={actionData?.error}
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
          name="password"
          label="Password"
          type="password"
        />
        <FormControlLabel
          control={<Checkbox name="remember" color="primary" />}
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
        <Grid container>
          <Grid item xs>
            <Link to="/forgotPassword" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link to="/register" variant="body2">
              Don't have an account? Sign Up
            </Link>
          </Grid>
        </Grid>
      </Form>
    </Box>
  )
}
