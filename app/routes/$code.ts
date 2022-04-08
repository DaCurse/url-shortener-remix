import type { LoaderFunction } from 'remix'
import { redirect } from 'remix'
import HttpStatus from '~/common/http-status.server'
import { getLink, incrementLinkVisits } from '~/services/link.service'

export const loader: LoaderFunction = async ({ params }) => {
  const { code } = params
  if (!code)
    throw new Response('Link not found', {
      status: HttpStatus.NOT_FOUND,
    })

  const link = await getLink(code)
  if (!link)
    throw new Response('Link not found', {
      status: HttpStatus.NOT_FOUND,
    })

  incrementLinkVisits(code)

  return redirect(link.url)
}

// A default export is required for errors to be caught by the global catch
// boundary
export default function () {
  return null
}
