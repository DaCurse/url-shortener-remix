import type { SessionIdStorageStrategy } from '@remix-run/node'
import { createSessionStorage } from '@remix-run/node'
import { prisma } from './db.server'

const DEFAULT_MAX_AGE = 3600
const DEFAULT_SECRET = 's3cr3t'

function createDatabaseSessionStorage(
  cookie: SessionIdStorageStrategy['cookie']
) {
  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      const { id } = await prisma.session.create({
        select: { id: true },
        data: {
          userId: data.userId,
          expires: expires || new Date(Date.now() + DEFAULT_MAX_AGE),
        },
      })
      return id
    },
    async readData(id) {
      return await prisma.session.findUnique({
        where: { id },
        include: { user: true },
      })
    },
    async updateData(id, data, expires) {
      await prisma.session.upsert({
        where: { id },
        update: {
          userId: data.userId,
          expires,
        },
        create: {
          id,
          userId: data.userId,
          expires: expires || new Date(Date.now() + DEFAULT_MAX_AGE),
        },
      })
    },
    async deleteData(id) {
      await prisma.session.delete({ where: { id } })
    },
  })
}

const { getSession, commitSession, destroySession } =
  createDatabaseSessionStorage({
    name: '__session',
    path: '/',
    httpOnly: true,
    maxAge: DEFAULT_MAX_AGE,
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET || DEFAULT_SECRET],
  })

export { getSession, commitSession, destroySession }
