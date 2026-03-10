import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import envs from '../../../../configs/envs.config'

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
    async signIn({ user, account, profile, email, credentials }) {
      
      // console.log("signin",user,account,profile,email,credentials);
      return true
    },
    // async redirect({ url, baseUrl }) {
    //   console.log("redirect",url,baseUrl);
    //   return baseUrl
    // },
    async jwt({ token }) {
      // console.log("jwt",token);
      return token
    }
  },
}

const handler = NextAuth(options)

export { handler as GET, handler as POST }