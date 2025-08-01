import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone number", type: "text", required: true },
        password: { label: "Password", type: "password", required: true },
        otp: { label: "OTP", type: "text", required: true },
      },

      async authorize(credentials: any) {
         const hashedPassword = await bcrypt.hash(credentials.password, 10);
        // 2. Password/user check
        const existingUser = await db.user.findFirst({
          where: { number: credentials.phone },
        });

        if (existingUser) {
          const passwordValidation = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              number: existingUser.number,
            };
          }
          return null;
        }

        // 3. Register new user
        try {
          console.log("hullululu");
          const user = await db.user.create({
            data: {
              number: credentials.phone,
              password: hashedPassword,
            },
          });
          return {
            id: user.id.toString(),
            name: user.name,
            number: user.number,
          };
        } catch (e) {
          console.error(e);
        }
        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) token.number = user.number;
      return token;
    },
    async session({ token, session }: any) {
      session.user.id = token.sub;
      session.user.number = token.number;
      return session;
    },
  },
};
