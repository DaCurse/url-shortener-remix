import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import HttpStatus from '~/common/http-status.server'
import { isValidTheme } from '~/common/theme'
import { themeCookie } from '~/common/theme.server'

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
