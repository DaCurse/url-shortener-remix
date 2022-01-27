import { nanoid } from 'nanoid'
import { useEffect, useRef } from 'react'
import { ActionFunction, Form, useActionData, useTransition } from 'remix'
import { z } from 'zod'
import prisma from '~/db.server'

const FormDataSchema = z.object({
  url: z.string().url(),
})

type ActionData = { code?: string; errors?: string[] }

export const action: ActionFunction = async ({
  request,
}): Promise<ActionData> => {
  const formData = await request.formData()
  const result = FormDataSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) {
    return { errors: result.error.issues.map(i => i.message) }
  }

  const { url } = result.data
  const code = nanoid(6)
  await prisma.link.create({ data: { code, url } })

  return { code }
}

export default function Shorten() {
  const actionData = useActionData<ActionData>()
  const transition = useTransition()
  const isSubmitting = transition.submission

  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isSubmitting) {
      formRef.current?.reset()
      inputRef.current?.focus()
    }
  }, [isSubmitting])

  return (
    <div>
      <h1>Shorten a URL</h1>
      <Form ref={formRef} method="post" replace>
        <input
          ref={inputRef}
          type="url"
          name="url"
          aria-label="URL to shorten"
          placeholder="URL"
        />
        <button type="submit">Shorten</button>
      </Form>
      {actionData?.errors &&
        actionData?.errors.map(error => <p>Error: {error}</p>)}
      {actionData?.code && (
        <p>
          Link created:{' '}
          <a
            href={`/${actionData?.code}`}
            target="_blank"
            rel="noreferrer"
          >{`${location.origin}/${actionData?.code}`}</a>
        </p>
      )}
    </div>
  )
}
