import { LoaderFunction, redirect } from 'remix'
import prisma from '~/db.server'

export const loader: LoaderFunction = async ({ params }) => {
  const { code } = params

  const link = await prisma.link.findUnique({
    select: {
      url: true,
    },
    where: { code },
  })
  if (!link) {
    throw new Error('Link not found')
  }

  await prisma.link.update({
    where: { code },
    data: { visits: { increment: 1 } },
  })

  return redirect(link.url)
}
