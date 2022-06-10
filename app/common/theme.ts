import { createTheme } from '@mui/material'

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

export const themes = {
  dark: darkTheme,
  light: lightTheme,
}

export function isValidTheme(themeName: string): themeName is ThemeName {
  return themes.hasOwnProperty(themeName)
}

export type ThemeName = keyof typeof themes

export const DEFAULT_THEME: ThemeName = 'dark'
