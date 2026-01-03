import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // 1. Admin Login (Hardcoded)
        if (credentials.email === "admin@lpba.com" && credentials.password === "admin123") {
          const user = await prisma.user.findUnique({
            where: { email: "admin@lpba.com" },
          })
          
          if (user && user.role === "ADMIN") {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
        }

        // 2. Regular User Login (Demo Mode)
        // Since we don't store passwords for users yet, we use a default password "user123" for all non-admin users
        // This allows testing the user dashboard with any valid email in the system.
        if (credentials.password === "user123") {
            const user = await prisma.user.findUnique({
                where: { email: credentials.email as string }
            });

            if (user) {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            }
        }

        return null
      },
    }),
  ],
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login
      return !!auth
    },
    jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
