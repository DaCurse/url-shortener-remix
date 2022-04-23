import { isIP } from 'is-ip'

// List of headers in order of preference to determine the client's IP address.
// `X-Fallback-IP` is a custom header set by an express middleware that contains
// the client's remote address, as you cannot access it via Remix's Request
// object
const headerNames = [
  'X-Client-IP',
  'X-Forwarded-For',
  'Fly-Client-IP',
  'CF-Connecting-IP',
  'Fastly-Client-Ip',
  'True-Client-Ip',
  'X-Real-IP',
  'X-Cluster-Client-IP',
  'X-Forwarded',
  'Forwarded-For',
  'Forwarded',
  'X-Fallback-IP',
] as const

// Taken from https://github.com/sergiodxa/remix-utils/blob/main/src/server/get-client-id-address.ts
export function getClientIP(request: Request) {
  const headers = request.headers

  const ipAddress = headerNames
    .flatMap(headerName => {
      const value = headers.get(headerName)
      if (headerName === 'Forwarded') {
        return parseForwardedHeader(value)
      }
      if (!value?.includes(', ')) return value
      return value.split(', ')
    })
    .find(ip => ip && isIP(ip))

  return ipAddress ?? null
}

function parseForwardedHeader(value: string | null) {
  if (!value) return null
  for (const part of value.split(';')) {
    if (part.startsWith('for=')) return part.slice(4)
    continue
  }
  return null
}
