import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import envs from '../../../../configs/envs.config'
import UserModel from '@/db/models/user.model'

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: envs.GOOGLE_CLIENT_ID.toString(),
      clientSecret: envs.GOOGLE_CLIENT_SECRET.toString(),
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  secret: envs.NEXTAUTH_SECRET.toString(),
  callbacks: {
    async signIn({ user }) {
      const exists = await UserModel.exists({email:user.email});

      if (!exists && user.email && user.name && user.image) {
        await UserModel.create({
          email: user.email,
          name: user.name,
        })
      }
      return true
    },
    async session({ session }) {
      // console.log(session)
      return session
    },
    async redirect({ url, baseUrl }) {
      // console.log("redirect",url,baseUrl);
      return baseUrl
    },
    async jwt({ token }) {
      // console.log("jwt",token);
      return token
    }
  },
}

const handler = NextAuth(options)

export { handler as GET, handler as POST }