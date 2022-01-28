import { CacheProvider, ThemeProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import { CssBaseline } from '@mui/material'
import { renderToString } from 'react-dom/server'
import type { EntryContext } from 'remix'
import { RemixServer } from 'remix'
import createEmotionCache from './material/create-emotion-cache'
import { getTheme } from './util/theme'
import { getUserTheme } from './util/theme.server'

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  const userTheme = await getUserTheme(request)
  const theme = getTheme(userTheme)
  const MuiRemixServer = () => (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RemixServer context={remixContext} url={request.url} />
      </ThemeProvider>
    </CacheProvider>
  )

  // Render the component to a string.
  const html = renderToString(<MuiRemixServer />)
  // Grab the CSS from emotion

  const { styles } = extractCriticalToChunks(html)
  const stylesHTML = styles.reduce((html, { key, ids, css }) => {
    const emotionKey = `${key} ${ids.join(' ')}`
    return html + `<style data-emotion-${emotionKey}>${css}</style>`
  }, '')

  // Add the emotion style tags after the insertion point meta tag
  const markup = html.replace(
    /<meta(\s)*name="emotion-insertion-point"(\s)*content="emotion-insertion-point"(\s)*\/>/,
    `<meta name="emotion-insertion-point" content="emotion-insertion-point"/>${stylesHTML}`
  )

  responseHeaders.set('Content-Type', 'text/html')

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
