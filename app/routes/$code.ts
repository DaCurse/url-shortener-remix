import type { LoaderFunction } from 'remix'
import { redirect } from 'remix'
import { getLink, incrementLinkVisits } from '~/services/link.service'
import HttpStatus from '~/util/http-status'

const NotFoundResponse = new Response('Link not found', {
  status: HttpStatus.NOT_FOUND,
})

export const loader: LoaderFunction = async ({ params }) => {
  const { code } = params
  if (!code) throw NotFoundResponse

  const link = await getLink(code)
  if (!link) throw NotFoundResponse

  incrementLinkVisits(code)

  return redirect(link.url)
}

// A default export is required for errors to be caught by the global catch
// boundary
export default function () {
  return null
}
