import GitHubIcon from '@mui/icons-material/GitHub'
import LinkIcon from '@mui/icons-material/Link'
import {
  Avatar,
  Box,
  Container,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import { Outlet } from '@remix-run/react'
import ThemeToggle from '~/components/ThemeToggle'

function Header() {
  return (
    <Box
      component="header"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'info.dark' }}>
        <LinkIcon />
      </Avatar>
      <Typography component="h1" variant="h4">
        URL Shortener
      </Typography>
    </Box>
  )
}

function Footer() {
  return (
    <Box component="footer" sx={{ mt: 2 }}>
      <Grid container>
        <Grid item xs>
          <Tooltip title="View source">
            <IconButton
              aria-label="GitHub Repository"
              href="https://github.com/DaCurse/url-shortener-remix"
              target="_blank"
              rel="noopener"
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs>
          <ThemeToggle />
        </Grid>
      </Grid>
    </Box>
  )
}
export default function IndexLayout() {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Header />
        <Outlet />
        <Footer />
      </Box>
    </Container>
  )
}
