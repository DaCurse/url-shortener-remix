import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import InsertLinkIcon from '@mui/icons-material/InsertLink'
import SendIcon from '@mui/icons-material/Send'
import type { IconButtonProps } from '@mui/material'
import {
  Alert,
  Grid,
  IconButton,
  InputAdornment,
  Link as MUILink,
  TextField,
  Tooltip,
} from '@mui/material'
import { useEffect, useRef } from 'react'
import type { ActionFunction, LoaderFunction, MetaFunction } from 'remix'
import { Form, json, useActionData, useLoaderData, useTransition } from 'remix'
import Link from '~/components/Link'
import { createLink } from '~/services/link.service'
import { getSession } from '~/session.server'
import { ShortenFormData } from '~/util/schemas.server'

type LoaderData = { loggedUser?: string }
type ActionData = { shortenedUrl?: string; error?: string }

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))
  return json<LoaderData>({ loggedUser: session.get('user')?.email })
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
  return (
    <IconButton onClick={() => navigator.clipboard.writeText(data)}>
      <ContentCopyIcon />
    </IconButton>
  )
}

function SuccessAlert({ url }: { url: string }) {
  return (
    <Alert sx={{ mt: 1 }} severity="success" action={<CopyButton data={url} />}>
      Link created:{' '}
      <MUILink href={url} target="_blank" rel="noreferrer">
        {url}
      </MUILink>
    </Alert>
  )
}

export default function Shorten() {
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
        {loaderData?.loggedUser ? (
          <Alert severity="info">Logged in as {loaderData?.loggedUser}</Alert>
        ) : (
          <Alert severity="info">
            <Link to="/user/login">Login</Link> or{' '}
            <Link to="/user/register">Register</Link> to create vanity links and
            view statistics
          </Alert>
        )}
      </Grid>
    </Grid>
  )
}
