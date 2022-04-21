import type { Session, User } from '@prisma/client'
import { prisma } from '../db.server'

export async function createSession(
  userId: User['id'],
  expires: Session['expires']
) {
  const { id } = await prisma.session.create({
    select: { id: true },
    data: { userId, expires },
  })
  return id
}

export async function getSessionById(id: Session['id']) {
  return await prisma.session.findUnique({
    where: { id },
    include: { user: true },
  })
}

export async function updateOrCreateSession(
  id: Session['id'],
  userId: User['id'],
  expires: Session['expires']
) {
  await prisma.session.upsert({
    where: { id },
    update: { userId, expires },
    create: { id, userId, expires },
  })
}

export async function deleteSession(id: Session['id']) {
  await prisma.session.delete({ where: { id } })
}
