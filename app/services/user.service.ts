import type { User } from '@prisma/client'
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

export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { email },
  })
  if (!user) {
    throw new Error('User not found')
  }
  const isValid = await argon2.verify(user.password, password)
  if (!isValid) {
    throw new Error('Invalid password')
  }
  return user
}
