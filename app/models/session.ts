import type { Session, User } from '@prisma/client'
import { prisma } from '../db.server'

export async function doesSessionExist(id: Session['id']) {
  const session = await prisma.session.findUnique({
    where: { id },
  })
  return !!session
}

export async function createSession(
  userId: User['id'],
  expires: Session['expires']
) {
  return await prisma.session.create({
    select: { id: true },
    data: { userId, expires },
  })
}

export async function getSessionById(id: Session['id']) {
  return await prisma.session.findUnique({
    where: { id },
    include: { user: true },
  })
}

export async function updateSession(
  id: Session['id'],
  userId: User['id'],
  expires: Session['expires']
) {
  await prisma.session.update({
    where: { id },
    data: { userId, expires },
  })
}

export async function deleteSession(id: Session['id']) {
  await prisma.session.delete({ where: { id } })
}
