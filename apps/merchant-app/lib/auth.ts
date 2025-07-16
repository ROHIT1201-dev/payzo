import type { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import db from "@repo/db/client"

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("hi signin")

      const email = user?.email
      const name = user?.name

      // Defensive check
      if (!email || !account?.provider) {
        return false
      }

      await db.merchant.upsert({
        select: { id: true },
        where: { email },
        create: {
          email,
          name: name || "",
          auth_type: account.provider === "google" ? "Google" : "Github",
        },
        update: {
          name: name || "",
          auth_type: account.provider === "google" ? "Google" : "Github",
        },
      })

      return true
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "secret"
}