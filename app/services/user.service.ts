import argon2 from 'argon2'
import prisma from '~/db.server'

export async function doesUserExist(email: string) {
  const user = await prisma.user.findFirst({
    where: { email },
  })
  return !!user
}

export async function createUser(email: string, password: string) {
  await prisma.user.create({
    data: { email, password: await argon2.hash(password) },
  })
}
