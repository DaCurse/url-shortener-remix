import { hydrate } from 'react-dom'
import { RemixBrowser } from 'remix'
import ClientCacheProvider from './material/ClientCacheProvider.client'

hydrate(
  <ClientCacheProvider>
    <RemixBrowser />
  </ClientCacheProvider>,
  document
)
