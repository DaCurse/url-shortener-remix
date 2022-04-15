import type { User } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { prisma } from '~/db.server'

const SALT_LENGTH = 10

export async function doesUserExist(email: User['email']) {
  const user = await prisma.user.findFirst({
    where: { email },
  })
  return !!user
}

export async function createUser(
  email: User['email'],
  password: User['password']
) {
  await prisma.user.create({
    data: { email, password: await bcrypt.hash(password, SALT_LENGTH) },
  })
}

export async function loginUser(
  email: User['email'],
  password: User['password']
): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { email },
  })
  if (!user) {
    throw new Error('User not found')
  }
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw new Error('Invalid password')
  }
  return user
}
