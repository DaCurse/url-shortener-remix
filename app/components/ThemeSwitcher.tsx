import Brightness2Icon from '@mui/icons-material/Brightness2'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { IconButton, Tooltip } from '@mui/material'
import { useFetcher, useLoaderData } from 'remix'

export default function ThemeSwitcher() {
  const { userTheme } = useLoaderData()
  const fetcher = useFetcher()

  return (
    <fetcher.Form
      method="post"
      action="/setTheme"
      style={{ display: 'inline-block' }}
    >
      <input
        type="hidden"
        name="theme"
        value={userTheme === 'light' ? 'dark' : 'light'}
      />
      <Tooltip title="Toggle theme">
        <IconButton type="submit" aria-label="Toggle theme">
          {userTheme === 'light' ? <Brightness7Icon /> : <Brightness2Icon />}
        </IconButton>
      </Tooltip>
    </fetcher.Form>
  )
}
