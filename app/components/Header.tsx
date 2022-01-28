import LinkIcon from '@mui/icons-material/Link'
import { Avatar, Box, Typography } from '@mui/material'

export default function Header() {
  return (
    <Box
      component="header"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'info.dark' }}>
        <LinkIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        URL Shortener
      </Typography>
    </Box>
  )
}
