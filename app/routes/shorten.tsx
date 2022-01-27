import { nanoid } from 'nanoid'
import { ActionFunction, Form, useActionData } from 'remix'
import { z } from 'zod'
import prisma from '~/db.server'

const ActionDataSchema = z.object({
  url: z.string().url(),
})

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  // TODO: Handle zod error
  const { url } = ActionDataSchema.parse(Object.fromEntries(formData))

  const code = nanoid(6)
  // TODO: Handle unique constraint error
  await prisma.link.create({
    data: {
      code,
      url,
    },
  })

  return code
}

export default function Shorten() {
  const code = useActionData()

  return (
    <div>
      <h1>Shorten a URL</h1>
      <Form method="post">
        <input
          type="url"
          name="url"
          aria-label="URL to shorten"
          placeholder="URL"
        />
        <button type="submit">Shorten</button>
      </Form>
      {code && (
        <p>
          Link created:{' '}
          <a
            href={`/${code}`}
            target="_blank"
            rel="noreferrer"
          >{`${location.origin}/${code}`}</a>
        </p>
      )}
    </div>
  )
}
