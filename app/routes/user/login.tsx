import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import type { MetaFunction } from 'remix'
import { Form } from 'remix'
import Link from '~/components/Link'

export const meta: MetaFunction = () => {
  return {
    title: 'URL Shortener - Login',
  }
}

export default function Login() {
  return (
    <Box component="section" justifyContent="center">
      <header>
        <Typography component="h2" variant="h5">
          Sign in
        </Typography>
      </header>
      <Typography>
        <Link to="/shorten" sx={{ mx: 'auto' }}>
          ← Go back
        </Link>
      </Typography>
      <Form>
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
          Sign In
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
