import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { FirestoreAdapter } from "@next-auth/firebase-adapter"
import { db } from '../../../firebase-admin';
import type { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async session({ session, user, token }) {
      // console.log('session ', session, user, token);
      session.user.id = token.uid;
      return session
    },
    async jwt({ token }) {
      const email = token.email;
      const userRef = db.collection('users');
      const snapshot = await userRef.where('email', '==', email).get();
      token.uid = snapshot.docs[0].id;
      // console.log('jwt ', token);
      return token
    }
  },
  adapter: FirestoreAdapter(db),
}

export default NextAuth(authOptions);
