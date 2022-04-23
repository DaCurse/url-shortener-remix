import type { SessionIdStorageStrategy } from '@remix-run/node'
import { createSessionStorage, redirect } from '@remix-run/node'
import {
  createSession,
  deleteSession,
  doesSessionExist,
  getSessionById,
  updateSession,
} from './models/session.server'

const DEFAULT_MAX_AGE = 3600
const DEFAULT_SECRET = 's3cr3t'
const INVALID_SESSION_REDIRECT = '/'

function createDatabaseSessionStorage(
  cookie: SessionIdStorageStrategy['cookie']
) {
  return createSessionStorage({
    cookie,
    async createData(data, expires) {
      const { id } = await createSession(
        data.userId,
        expires || new Date(Date.now() + DEFAULT_MAX_AGE)
      )
      return id
    },
    async readData(id) {
      const sessionData = await getSessionById(id)
      return sessionData ?? { invalid: true }
    },
    async updateData(id, data, expires) {
      await updateSession(
        id,
        data.userId,
        expires || new Date(Date.now() + DEFAULT_MAX_AGE)
      )
    },
    async deleteData(id) {
      if (!(await doesSessionExist(id))) return
      await deleteSession(id)
    },
  })
}

const {
  getSession: _getSession,
  commitSession,
  destroySession,
} = createDatabaseSessionStorage({
  name: '__session',
  path: '/',
  httpOnly: true,
  maxAge: DEFAULT_MAX_AGE,
  sameSite: 'lax',
  secrets: [process.env.SESSION_SECRET || DEFAULT_SECRET],
})

async function getSession(...args: any[]) {
  const session = await _getSession(...args)

  if (session.has('invalid')) {
    throw redirect(INVALID_SESSION_REDIRECT, {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    })
  }

  return session
}

export { getSession, commitSession, destroySession }
