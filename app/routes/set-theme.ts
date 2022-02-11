import type { ActionFunction, LoaderFunction } from 'remix'
import { redirect } from 'remix'
import HttpStatus from '~/util/http-status'
import { isValidTheme } from '~/util/theme'
import { themeCookie } from '~/util/theme.server'

export const loader: LoaderFunction = () => {
  throw new Response('Bad Request', { status: HttpStatus.BAD_REQUEST })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const themeName = String(formData.get('theme'))
  if (!isValidTheme(themeName)) {
    throw new Response('Invalid theme name', { status: HttpStatus.BAD_REQUEST })
  }

  return redirect(request.headers.get('Referer') || '/', {
    headers: {
      'Set-Cookie': await themeCookie.serialize(themeName),
    },
  })
}
