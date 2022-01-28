import { withEmotionCache } from '@emotion/react'
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material'
import { useContext } from 'react'
import {
  Links,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'remix'
import Layout from './components/Layout'
import ClientStyleContext from './material/ClientStyleContext'
import theme from './material/theme'

export const meta: MetaFunction = () => {
  return {
    title: 'URL Shortener',
    description: 'A URL Shortener made with Remix',
  }
}

interface DocumentProps {
  children: React.ReactNode
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const clientStyleData = useContext(ClientStyleContext)

    // Only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head
      // re-inject tags
      const tags = emotionCache.sheet.tags
      emotionCache.sheet.flush()
      tags.forEach(tag => {
        // eslint-disable-next-line no-underscore-dangle
        ;(emotionCache.sheet as any)._insertTag(tag)
      })
      // reset cache to reapply global styles
      clientStyleData.reset()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="theme-color" content={theme.palette.primary.main} />

          <Meta />
          <Links />

          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
          <meta
            name="emotion-insertion-point"
            content="emotion-insertion-point"
          />
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
          {process.env.NODE_ENV === 'development' && <LiveReload />}
        </body>
      </html>
    )
  }
)

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}
