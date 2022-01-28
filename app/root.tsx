import { ThemeProvider, withEmotionCache } from '@emotion/react'
import {
  Alert,
  AlertTitle,
  CssBaseline,
  Link as MUILink,
  Theme,
  unstable_useEnhancedEffect as useEnhancedEffect,
} from '@mui/material'
import { useContext } from 'react'
import {
  HeadersFunction,
  Link as RemixLink,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from 'remix'
import Layout from './components/Layout'
import ClientStyleContext from './material/ClientStyleContext.client'
import { getTheme } from './util/theme'
import { getUserTheme } from './util/theme.server'

export const loader: LoaderFunction = async ({ request }) => {
  return { userTheme: await getUserTheme(request) }
}

export const headers: HeadersFunction = () => ({
  'Accept-CH': 'Sec-CH-Prefers-Color-Scheme',
})

export const meta: MetaFunction = () => {
  return {
    title: 'URL Shortener',
    description: 'A URL Shortener made with Remix',
  }
}

interface DocumentProps {
  theme: Theme
  children: React.ReactNode
}

const Document = withEmotionCache(
  ({ theme, children }: DocumentProps, emotionCache) => {
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
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>

          <ScrollRestoration />
          <Scripts />
          {process.env.NODE_ENV === 'development' && <LiveReload />}
        </body>
      </html>
    )
  }
)

export default function App() {
  const { userTheme } = useLoaderData()
  const theme = getTheme(userTheme)
  return (
    <Document theme={theme}>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  const { userTheme } = useLoaderData()
  const theme = getTheme(userTheme)
  return (
    <Document theme={theme}>
      <Layout>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          An unknown error occured!
          {process.env.NODE_ENV === 'development' && <pre>{error.stack}</pre>}
        </Alert>
      </Layout>
    </Document>
  )
}

export function CatchBoundary() {
  const { userTheme } = useLoaderData()
  const theme = getTheme(userTheme)
  const caught = useCatch()
  return (
    <Document theme={theme}>
      <Layout>
        <Alert severity="error">
          <AlertTitle>
            {caught.status} - {caught.statusText}
          </AlertTitle>
          <MUILink component={RemixLink} to="/">
            Go back
          </MUILink>
        </Alert>
      </Layout>
    </Document>
  )
}
