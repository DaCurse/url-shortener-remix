import type { Visit } from '@prisma/client'
import { prisma } from '~/db.server'

export async function createVisit(
  linkId: Visit['linkId'],
  visitedAt: Visit['visitedAt'],
  ipAddress: Visit['ipAddress'],
  userAgent: Visit['userAgent']
) {
  await prisma.visit.create({
    data: {
      link: {
        connect: {
          id: linkId,
        },
      },
      visitedAt,
      ipAddress,
      userAgent,
    },
  })
}
