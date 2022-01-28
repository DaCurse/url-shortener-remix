import { LoaderFunction, redirect } from 'remix'
import { getLink, incrementLinkVisits } from '~/services/link.service'

const NotFoundResponse = new Response('Not Found', {
  status: 404,
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
