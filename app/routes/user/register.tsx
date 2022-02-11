import { Box, Button, TextField, Typography } from '@mui/material'
import type { MetaFunction } from 'remix'
import { Form } from 'remix'
import Link from '~/components/Link'

export const meta: MetaFunction = () => {
  return {
    title: 'URL Shortener - Register',
  }
}

export default function Register() {
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
        <TextField
          margin="normal"
          required
          fullWidth
          name="password-confirm"
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
