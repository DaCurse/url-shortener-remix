import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import InsertLinkIcon from '@mui/icons-material/InsertLink'
import SendIcon from '@mui/icons-material/Send'
import type { IconButtonProps } from '@mui/material'
import {
  Alert,
  Grid,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  TextField,
  Tooltip,
} from '@mui/material'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from '@remix-run/react'
import { useEffect, useRef } from 'react'
import { ShortenFormData } from '~/common/schemas'
import Link from '~/components/Link'
import { createLink } from '~/models/link'
import { getSession } from '~/session.server'

interface LoaderData {
  loggedUser?: string
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))
  return json<LoaderData>({ loggedUser: session.get('user')?.email })
}
interface ActionData {
  shortenedUrl?: string
  error?: string
}

export const action: ActionFunction = async ({
  request,
}): Promise<ActionData> => {
  const formData = await request.formData()
  const result = ShortenFormData.safeParse(Object.fromEntries(formData))
  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const { url } = result.data
  const code = await createLink(url)
  const baseUrl = new URL(request.url).origin

  return { shortenedUrl: `${baseUrl}/${code}` }
}

export const meta: MetaFunction = () => {
  return {
    title: 'URL Shortener - Shorten your URL',
  }
}

export default function Index() {
  const loaderData = useLoaderData<LoaderData>()
  const actionData = useActionData<ActionData>()
  const transition = useTransition()
  const state: 'idle' | 'submitting' | 'error' = transition.submission
    ? 'submitting'
    : actionData?.error
    ? 'error'
    : 'idle'

  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state === 'submitting') {
      formRef.current?.reset()
    }
    if (state === 'idle') {
      inputRef.current?.focus()
    }
  }, [state])

  return (
    <Grid
      container
      rowSpacing={1}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item sx={{ width: '100%' }}>
        <Form ref={formRef} method="post" replace>
          <TextField
            inputRef={inputRef}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <InsertLinkIcon />
                </InputAdornment>
              ),
              endAdornment: <SubmitButton disabled={state === 'submitting'} />,
            }}
            fullWidth
            margin="normal"
            error={state === 'error'}
            helperText={actionData?.error}
            type="url"
            name="url"
            label="URL to shorten"
            aria-label="URL to shorten"
          />
        </Form>
      </Grid>
      {actionData?.shortenedUrl && (
        <Grid item sx={{ width: '100%' }}>
          <SuccessAlert url={actionData.shortenedUrl} />
        </Grid>
      )}
      <Grid item sx={{ width: '100%' }}>
        {loaderData.loggedUser ? (
          <Alert severity="info">Logged in as {loaderData.loggedUser}</Alert>
        ) : (
          <Alert severity="info">
            <Link to="/login">Login</Link> or{' '}
            <Link to="/register">Register</Link> to create vanity links and view
            statistics
          </Alert>
        )}
      </Grid>
    </Grid>
  )
}

function SubmitButton(props: IconButtonProps) {
  return (
    <Tooltip title="Send">
      <IconButton type="submit" {...props}>
        <SendIcon />
      </IconButton>
    </Tooltip>
  )
}

function CopyButton({ data }: { data: string }) {
  return navigator.clipboard ? (
    <IconButton onClick={() => navigator.clipboard.writeText(data)}>
      <ContentCopyIcon />
    </IconButton>
  ) : null
}

function SuccessAlert({ url }: { url: string }) {
  return (
    <Alert sx={{ mt: 1 }} severity="success" action={<CopyButton data={url} />}>
      Link created:{' '}
      <MuiLink href={url} target="_blank" rel="noreferrer">
        {url}
      </MuiLink>
    </Alert>
  )
}
