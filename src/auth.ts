import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb-adapter";

export const authOptions: NextAuthConfig = {
    adapter: MongoDBAdapter(clientPromise) as any,
    debug: process.env.NODE_ENV === "development",
    providers: [
        EmailProvider({
            server: {
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
            },
            from: process.env.SMTP_FROM || "noreply@felipeb12.com",
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID || process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET || process.env.AUTH_GITHUB_SECRET,
        }),
    ],
    callbacks: {
        async session({ session, token }: any) {
            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.role = token.role as "admin" | "editor" | "viewer";
            }
            return session;
        },
        async jwt({ token, user, trigger, session }: any) {
            if (user) {
                token.id = user.id;
                token.role = user.role || "viewer";
            }

            if (trigger === "update" && session?.role) {
                token.role = session.role;
            }

            return token;
        },
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
