import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const datasourceUrl = process.env.DATABASE_URL

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: datasourceUrl as string,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
