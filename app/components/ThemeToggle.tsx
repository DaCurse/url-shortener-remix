import Brightness2Icon from '@mui/icons-material/Brightness2'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { IconButton, Tooltip } from '@mui/material'
import { useFetcher, useMatches } from '@remix-run/react'
import type { RootLoaderData } from '~/root'

export default function ThemeToggle() {
  const rootLoaderData = useMatches().find(match => match.id === 'root')
    ?.data as RootLoaderData | undefined
  const fetcher = useFetcher()

  return (
    <fetcher.Form
      method="post"
      action="/set-theme"
      style={{ display: 'inline-block' }}
    >
      <input
        type="hidden"
        name="theme"
        value={rootLoaderData?.themeName === 'dark' ? 'light' : 'dark'}
      />
      <Tooltip title="Toggle theme">
        <IconButton type="submit" aria-label="Toggle theme">
          {rootLoaderData?.themeName === 'dark' ? (
            <Brightness2Icon />
          ) : (
            <Brightness7Icon />
          )}
        </IconButton>
      </Tooltip>
    </fetcher.Form>
  )
}
