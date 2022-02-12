import type { LoaderFunction } from 'remix'
import { redirect } from 'remix'
import { getLink, incrementLinkVisits } from '~/services/link.service'
import HttpStatus from '~/util/http-status.server'

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
