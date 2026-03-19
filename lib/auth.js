import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const email = String(credentials?.email ?? "");
                const password = String(credentials?.password ?? "");
                if (!email || !password) {
                    return null;
                }
                const user = await prisma.user.findUnique({
                    where: { email },
                });
                if (!user) {
                    return null;
                }
                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                    return null;
                }
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    assignedSections: user.assignedSections,
                };
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
                token.role = user.role ?? "CUSTOMER";
                token.assignedSections = user.assignedSections ?? "BLOG";
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (session.user) {
                session.user.id = String(token.id ?? "");
                session.user.role = String(token.role ?? "CUSTOMER");
                session.user.assignedSections = String(token.assignedSections ?? "BLOG");
            }
            return session;
        },
    },
});
