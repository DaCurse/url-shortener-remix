import { nanoid } from 'nanoid'
import { prisma } from '~/db.server'

export async function createLink(url: string) {
  const code = nanoid(6)
  await prisma.link.create({ data: { code, url } })
  return code
}

export async function getLink(code: string) {
  const link = await prisma.link.findUnique({
    select: {
      url: true,
    },
    where: { code },
  })
  return link
}

export async function incrementLinkVisits(code: string) {
  await prisma.link.update({
    where: { code },
    data: { visits: { increment: 1 } },
  })
}
