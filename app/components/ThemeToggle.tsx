import Brightness2Icon from '@mui/icons-material/Brightness2'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { IconButton, Tooltip } from '@mui/material'
import { useFetcher, useLoaderData } from 'remix'
import type { RootLoaderData } from '~/root'

export default function ThemeToggle() {
  const loaderData = useLoaderData<RootLoaderData>()
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
        value={loaderData?.themeName === 'dark' ? 'light' : 'dark'}
      />
      <Tooltip title="Toggle theme">
        <IconButton type="submit" aria-label="Toggle theme">
          {loaderData?.themeName === 'dark' ? (
            <Brightness2Icon />
          ) : (
            <Brightness7Icon />
          )}
        </IconButton>
      </Tooltip>
    </fetcher.Form>
  )
}
