import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
    // Added later in auth.ts
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnAuth = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');

      if (isOnDashboard || isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && isOnAuth) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
    jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
