import { ActionFunction, LoaderFunction, redirect } from 'remix'
import { themeCookie } from '~/util/theme.server'

export const loader: LoaderFunction = () => {
  throw new Response('Bad Request', { status: 400 })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  return redirect(request.headers.get('referer') || '/', {
    headers: {
      'Set-Cookie': await themeCookie.serialize(formData.get('theme')),
    },
  })
}
