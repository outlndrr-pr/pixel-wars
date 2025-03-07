import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { nanoid } from 'nanoid';

// Configure NextAuth options
export const authOptions: NextAuthOptions = {
  providers: [
    // Anonymous sessions - minimal friction for users
    CredentialsProvider({
      id: 'anonymous',
      name: 'Anonymous',
      credentials: {},
      async authorize() {
        // Generate a random id for anonymous users
        return {
          id: nanoid(),
          name: `Anonymous_${nanoid(4)}`,
          isAnonymous: true
        };
      },
    }),
    
    // Google provider for signed-in users
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  
  // Using JWT for sessions
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Custom JWT callback to include isAnonymous flag
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAnonymous = !!(user as { isAnonymous?: boolean }).isAnonymous;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { isAnonymous?: boolean }).isAnonymous = !!(token as { isAnonymous?: boolean }).isAnonymous;
      }
      return session;
    },
  },
  
  // Custom pages
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  
  // Debug mode - set to false in production
  debug: process.env.NODE_ENV === 'development',
};

// Export the handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 

// Triggering a new deployment with this comment 