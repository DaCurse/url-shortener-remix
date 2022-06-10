import { RemixBrowser } from '@remix-run/react'
import { hydrate } from 'react-dom'
import ClientCacheProvider from './material/ClientCacheProvider.client'

hydrate(
  <ClientCacheProvider>
    <RemixBrowser />
  </ClientCacheProvider>,
  document
)
