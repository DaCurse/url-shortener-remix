import { Box, Container } from '@mui/material'
import Footer from './Footer'
import Header from './Header'

export default function Layout({ children }: { children: React.ReactNode }) {
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
        {children}
        <Footer />
      </Box>
    </Container>
  )
}
