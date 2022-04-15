import type { Link } from '@prisma/client'
import { nanoid } from 'nanoid'
import { prisma } from '~/db.server'

export async function createLink(url: Link['url']) {
  const code = nanoid(6)
  await prisma.link.create({ data: { code, url } })
  return code
}

export async function getLink(code: Link['code']) {
  const link = await prisma.link.findUnique({
    select: {
      url: true,
    },
    where: { code },
  })
  return link
}

export async function incrementLinkVisits(code: Link['code']) {
  await prisma.link.update({
    where: { code },
    data: { visits: { increment: 1 } },
  })
}
