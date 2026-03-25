import type { NextAuthConfig } from "next-auth";

/**
 * Shared JWT/session callbacks (no Prisma here — those live in auth.ts).
 * Route protection uses the (app) layout + `auth()`, not Edge middleware.
 */
export default {
  trustHost: true,
  pages: { signIn: "/login" },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
} satisfies NextAuthConfig;
