import { createCookie } from 'remix'
import { DEFAULT_THEME } from './theme'

export const themeCookie = createCookie('theme')

async function getThemeCookie(request: Request): Promise<any> {
  return await themeCookie.parse(request.headers.get('cookie'))
}

export async function getUserTheme(request: Request): Promise<string> {
  const userPreferredTheme = await getThemeCookie(request)
  const systemPreferredTheme = request.headers.get(
    'Sec-CH-Prefers-Color-Scheme'
  )
  return userPreferredTheme ?? systemPreferredTheme ?? DEFAULT_THEME
}
