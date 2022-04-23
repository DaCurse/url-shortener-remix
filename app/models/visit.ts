import type { Visit } from '@prisma/client'
import { prisma } from '~/db.server'

export async function createVisit(
  linkId: Visit['linkId'],
  userAgent: Visit['userAgent'],
  ipAddress: Visit['ipAddress'],
  visitedAt?: Visit['visitedAt']
) {
  await prisma.visit.create({
    data: {
      link: {
        connect: {
          id: linkId,
        },
      },
      userAgent,
      ipAddress,
      visitedAt,
    },
  })
}
