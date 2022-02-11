import type { ActionFunction, LoaderFunction } from 'remix'
import { redirect } from 'remix'
import { themes } from '~/util/theme'
import { themeCookie } from '~/util/theme.server'

export const loader: LoaderFunction = () => {
  throw new Response('Bad Request', { status: 400 })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const themeName = String(formData.get('theme-name'))
  if (!themes.hasOwnProperty(themeName)) {
    throw new Response('Invalid theme name', { status: 400 })
  }

  return redirect(request.headers.get('Referer') || '/', {
    headers: {
      'Set-Cookie': await themeCookie.serialize(formData.get('theme-name')),
    },
  })
}
