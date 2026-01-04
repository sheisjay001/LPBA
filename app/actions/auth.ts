'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: 'User already exists' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        state: 'NEW', // Default state
      },
    })

    return { success: 'User created successfully' }
  } catch (error) {
    console.error('Registration error:', error)
    return { error: 'Failed to create user' }
  }
}
