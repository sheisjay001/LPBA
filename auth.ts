import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) return null

        // Migration for Admin: If admin has no password set (or legacy), allow "admin123" and hash it immediately
        if (user.role === "ADMIN" && !user.password && credentials.password === "admin123") {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword }
            });
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            };
        }

        // Secure Password Verification
        if (user.password) {
            const isValid = await bcrypt.compare(credentials.password as string, user.password);
            if (isValid) {
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
