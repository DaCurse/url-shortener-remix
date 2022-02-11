import { createCookie } from 'remix'
import { DEFAULT_THEME, isValidTheme, ThemeName } from './theme'

export const themeCookie = createCookie('theme', {
  maxAge: 31_536_000, // One year
})

async function getThemeCookie(request: Request): Promise<string> {
  return String(
    await themeCookie.parse(request.headers.get('Cookie'))
  ).toLowerCase()
}

export async function getUserTheme(request: Request): Promise<ThemeName> {
  const userPreferredTheme = await getThemeCookie(request)
  const systemPreferredTheme = String(
    request.headers.get('Sec-CH-Prefers-Color-Scheme')
  ).toLowerCase()

  if (isValidTheme(userPreferredTheme)) return userPreferredTheme
  if (isValidTheme(systemPreferredTheme)) return systemPreferredTheme

  return DEFAULT_THEME
}
