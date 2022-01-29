import { createTheme, Theme } from '@mui/material'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

const themes: Record<string, Theme> = {
  dark: darkTheme,
  light: lightTheme,
}

export const DEFAULT_THEME = 'dark'

export function getTheme(themeName: string = DEFAULT_THEME): Theme {
  return themes.hasOwnProperty(themeName)
    ? themes[themeName]
    : themes[DEFAULT_THEME]
}
