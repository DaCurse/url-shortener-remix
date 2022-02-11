import GitHubIcon from '@mui/icons-material/GitHub'
import { Box, Grid, IconButton, Tooltip } from '@mui/material'
import ThemeToggle from './ThemeToggle'

export default function Footer() {
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
