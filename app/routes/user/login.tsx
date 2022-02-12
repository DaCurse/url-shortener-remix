import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import type { ActionFunction, MetaFunction } from 'remix'
import { Form, json, useActionData } from 'remix'
import Link from '~/components/Link'
import { loginUser } from '~/services/user.service'
import HttpStatus from '~/util/http-status.server'
import { LoginFormData } from '~/util/schemas.server'

type ActionData = { error?: string }

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  try {
    const { email, password } = LoginFormData.parse(
      Object.fromEntries(formData)
    )
    loginUser(email, password)
  } catch {
    return json<ActionData>(
      { error: 'Invalid email or password' },
      { status: HttpStatus.UNAUTHORIZED }
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
        <Link to="/shorten">← Go back</Link>
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
            <Link to="/user/forgotPassword" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link to="/user/register" variant="body2">
              Don't have an account? Sign Up
            </Link>
          </Grid>
        </Grid>
      </Form>
    </Box>
  )
}
