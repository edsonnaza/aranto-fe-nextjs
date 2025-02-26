import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { Role } from "@prisma/client";

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials): Promise<AuthUser | null> {
        console.log("Credenciales recibidas:", credentials);
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

          if (!parsedCredentials.success) {
            console.log("❌ Error en validación de credenciales");
            return null;
          }

        const { email, password } = parsedCredentials.data;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          console.log("❌ Usuario no encontrado");
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          console.log("❌ Contraseña incorrecta");
          return null;
        }
        console.log("✅ Usuario autenticado:", user);
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as AuthUser).role;
      }
      console.log({token})
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as Role;
      }
      console.log({session})
      return session;
    },
  },
});
