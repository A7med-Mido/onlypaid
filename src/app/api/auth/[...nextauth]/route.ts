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
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "name" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }

        if (credentials) {
          // Any object returned will be saved in `user` property of the JWT
          console.log(credentials)
          return user
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
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
      console.log("signin",user,account,profile,email,credentials);
      return true
    },
    // async redirect({ url, baseUrl }) {
    //   console.log("redirect",url,baseUrl);
    //   return baseUrl
    // },
    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log("jwt",token);
      return token
    }
  },
}

const handler = NextAuth(options)

export { handler as GET, handler as POST }