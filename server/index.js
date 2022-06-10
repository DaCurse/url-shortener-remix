const path = require('path')
const express = require('express')
const compression = require('compression')
const morgan = require('morgan')
const {
  createRequestHandler: createRemixRequestHandler,
} = require('@remix-run/express')
const { startCronJobs } = require('./cron')

const BUILD_DIR = path.join(process.cwd(), 'server/build')

const app = express()

app.use(compression())

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by')

// Remix fingerprints its assets so we can cache forever.
app.use(
  '/build',
  express.static('public/build', { immutable: true, maxAge: '1y' })
)

// Caching for static assets.
app.use(express.static('public', { maxAge: '1w' }))

app.use(morgan('tiny'))

// Cleans up URLs that end with a slash, this also prevents Remix from throwing
// an exception when the URL contains just slashes.
app.use((req, res, next) => {
  if (req.path.endsWith('/') && req.path.length > 1) {
    const query = req.url.slice(req.path.length)
    const safePath = req.path.slice(0, -1).replace(/\/+/g, '/')
    res.redirect(301, safePath + query)
  } else {
    next()
  }
})

app.all(
  '*',
  process.env.NODE_ENV === 'development'
    ? (req, res, next) => {
        purgeRequireCache()
        return createRequestHandler()(req, res, next)
      }
    : createRequestHandler()
)
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`)
  startCronJobs()
})

/**
 *  Purge require cache on requests for "server side HMR". This won't let you have
 *  in-memory objects between requests in development, alternatively you can set up
 *  nodemon/pm2-dev to restart the server on file changes, but then you'll have to
 *  reconnect to databases/etc on each change. We prefer the DX of this, so we've
 *  included it for you by default
 */
function purgeRequireCache() {
  for (let key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key]
    }
  }
}

/**
 * Creates the Remix request handler
 */
function createRequestHandler() {
  return createRemixRequestHandler({
    getLoadContext,
    build: require(BUILD_DIR),
    mode: process.env.NODE_ENV,
  })
}

/**
 * Remix will call this function to get additional context for the current
 * request in loaders.
 * @param {express.Request} req
 * @param {express.Response} _res
 * @returns {object}
 */
function getLoadContext(req, _res) {
  return { clientIP: req.socket.remoteAddress }
}
