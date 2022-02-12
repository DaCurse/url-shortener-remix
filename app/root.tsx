import { ThemeProvider, withEmotionCache } from '@emotion/react'
import {
  Alert,
  AlertTitle,
  CssBaseline,
  Typography,
  unstable_useEnhancedEffect as useEnhancedEffect,
} from '@mui/material'
import nProgress from 'nprogress'
import nProgressStyles from 'nprogress/nprogress.css'
import { useContext, useEffect } from 'react'
import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  ShouldReloadFunction,
} from 'remix'
import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useTransition,
} from 'remix'
import Layout from './components/Layout'
import Link from './components/Link'
import ClientStyleContext from './material/ClientStyleContext.client'
import type { ThemeName } from './util/theme'
import { DEFAULT_THEME, themes } from './util/theme'
import { getUserTheme } from './util/theme.server'

export const headers: HeadersFunction = () => ({
  'Accept-CH': 'Sec-CH-Prefers-Color-Scheme',
})

export const meta: MetaFunction = () => {
  return {
    title: 'URL Shortener',
    description: 'A URL Shortener made with Remix',
  }
}
export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: nProgressStyles }]
}

export type RootLoaderData = { themeName: ThemeName; loggedUser?: string }

export const loader: LoaderFunction = async ({ request }) => {
  return json<RootLoaderData>({ themeName: await getUserTheme(request) })
}

export const unstable_shouldReload: ShouldReloadFunction = ({ submission }) => {
  // Disable reload of theme when another mutation is in place, `submission` is
  // `undefined` when using a fetcher.Form - this is a bug, so this is a hacky
  // fix for now
  return !submission
}

interface DocumentProps {
  children: React.ReactNode
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const loaderData = useLoaderData<RootLoaderData>()
    const theme = themes[loaderData?.themeName ?? DEFAULT_THEME]
    const transition = useTransition()
    const clientStyleData = useContext(ClientStyleContext)

    useEffect(() => {
      // When the state is idle then we can complete the progress bar
      if (transition.state === 'idle') nProgress.done()
      // And when it's something else it means it's either submitting a form or
      // waiting for the loaders of the next location so we start it
      else nProgress.start()
    }, [transition.state])

    useEnhancedEffect(() => {
      // Re-link sheet container
      emotionCache.sheet.container = document.head
      // Re-inject tags
      const tags = emotionCache.sheet.tags
      emotionCache.sheet.flush()
      tags.forEach(tag => {
        ;(emotionCache.sheet as any)._insertTag(tag)
      })
      // Reset cache to reapply global styles
      clientStyleData.reset()
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
            <Layout>{children}</Layout>
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
  return (
    <Document>
      <Outlet />
    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document>
      <Alert severity="error" sx={{ mt: 2 }}>
        <AlertTitle>Error</AlertTitle>
        <Typography>An unknown error occurred!</Typography>
        {process.env.NODE_ENV === 'development' && (
          <pre style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
            {error.stack}
          </pre>
        )}
        <Link to="/" variant="body1">
          Go back
        </Link>
      </Alert>
    </Document>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  return (
    <Document>
      <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
        <AlertTitle>
          {caught.status} - {caught.statusText}
        </AlertTitle>
        <Typography>{caught.data}</Typography>
        <Link to="/" variant="body1">
          Go back
        </Link>
      </Alert>
    </Document>
  )
}
