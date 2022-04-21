import type { SessionIdStorageStrategy } from '@remix-run/node'
import { createSessionStorage } from '@remix-run/node'
import {
  createSession,
  deleteSession,
  getSessionById,
  updateOrCreateSession,
} from './models/session.server'

const DEFAULT_MAX_AGE = 3600
const DEFAULT_SECRET = 's3cr3t'

function createDatabaseSessionStorage(
  cookie: SessionIdStorageStrategy['cookie']
) {
  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      return await createSession(
        data.userId,
        expires || new Date(Date.now() + DEFAULT_MAX_AGE)
      )
    },
    async readData(id) {
      return await getSessionById(id)
    },
    async updateData(id, data, expires) {
      if (expires && new Date() > expires) return
      // TODO: Consider if upserting is necessary
      await updateOrCreateSession(
        id,
        data.userId,
        expires || new Date(Date.now() + DEFAULT_MAX_AGE)
      )
    },
    async deleteData(id) {
      await deleteSession(id)
    },
  })
}

export const { getSession, commitSession, destroySession } =
  createDatabaseSessionStorage({
    name: '__session',
    path: '/',
    httpOnly: true,
    maxAge: DEFAULT_MAX_AGE,
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET || DEFAULT_SECRET],
  })
