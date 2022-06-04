import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { getClientIP } from '~/common/get-client-ip'
import HttpStatus from '~/common/http-status'
import { getLink } from '~/models/link'
import { createVisit } from '~/models/visit'

export const loader: LoaderFunction = async ({ request, params, context }) => {
  const { code } = params
  invariant(typeof code === 'string', 'code is required')

  const link = await getLink(code)
  if (!link)
    throw new Response('Link not found', {
      status: HttpStatus.NOT_FOUND,
    })

  const userAgent = request.headers.get('User-Agent') ?? 'unknown'
  const ipAddress = getClientIP(request) ?? context.clientIP
  createVisit(link.id, userAgent, ipAddress)

  return redirect(link.url)
}

// A default export is required for errors to be caught by the global catch
// boundary
export default function () {
  return null
}
