import GitHubIcon from '@mui/icons-material/GitHub'
import { Box, IconButton, Tooltip } from '@mui/material'

export default function Footer() {
  return (
    <Box sx={{ mt: 2 }}>
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
    </Box>
  )
}
