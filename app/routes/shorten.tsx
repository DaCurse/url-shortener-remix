import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import InsertLinkIcon from '@mui/icons-material/InsertLink'
import SendIcon from '@mui/icons-material/Send'
import type { IconButtonProps } from '@mui/material'
import {
  Alert,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Tooltip,
} from '@mui/material'
import { useEffect, useRef } from 'react'
import type { ActionFunction } from 'remix'
import { Form, useActionData, useTransition } from 'remix'
import { z } from 'zod'
import AlertSnackbar from '~/components/AlertSnackbar'
import { createLink } from '~/services/link.service'

const FormDataSchema = z.object({
  url: z.string().url(),
})

type ActionData = { shortenedUrl?: string; errors?: string[] }

export const action: ActionFunction = async ({
  request,
}): Promise<ActionData> => {
  const formData = await request.formData()
  const result = FormDataSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) {
    return { errors: result.error.issues.map(i => i.message) }
  }

  const { url } = result.data
  const code = await createLink(url)
  const baseUrl = new URL(request.url).origin

  return { shortenedUrl: `${baseUrl}/${code}` }
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
      <Link href={url} target="_blank" rel="noreferrer">
        {url}
      </Link>
    </Alert>
  )
}

export default function Shorten() {
  const actionData = useActionData<ActionData>()
  const transition = useTransition()
  const state: 'idle' | 'submitting' | 'error' = transition.submission
    ? 'submitting'
    : actionData?.errors
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
    <>
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
          error={state === 'error'}
          type="url"
          name="url"
          label="URL to shorten"
          aria-label="URL to shorten"
        />
      </Form>
      {actionData?.shortenedUrl && (
        <SuccessAlert url={actionData.shortenedUrl} />
      )}
      {state === 'error' &&
        actionData?.errors?.map(error => (
          <AlertSnackbar message={error} severity="error" />
        ))}
    </>
  )
}
