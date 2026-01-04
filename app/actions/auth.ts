'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import type { Prisma } from '@prisma/client'

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function registerUser(formData: z.infer<typeof RegisterSchema>) {
  const validated = RegisterSchema.safeParse(formData)

  if (!validated.success) {
    return { error: 'Invalid fields' }
  }

  const { name, email, password } = validated.data
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedName = name.trim()

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return { error: 'User already exists' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
        state: 'NEW', // Default state
      },
    })

    return { success: 'User created successfully' }
  } catch (error) {
    if ((error as Prisma.PrismaClientKnownRequestError)?.code === 'P2002') {
      return { error: 'User already exists' }
    }
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Registration error:', message)
    return { error: `Failed to create user: ${message}` }
  }
}
