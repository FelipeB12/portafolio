import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb-adapter";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const authOptions: NextAuthConfig = {
    adapter: MongoDBAdapter(clientPromise) as any,
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
            from: process.env.SMTP_FROM || "noreply@portfolio.com",
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
            authorization: {
                params: {
                    scope: "read:user user:email",
                },
            },
        }),
    ],
    callbacks: {
        async session({ session, token }: any) {
            console.log("Session Callback - Token:", token);
            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.role = token.role as "admin" | "editor" | "viewer";
            }
            console.log("Session Callback - Final Session:", session);
            return session;
        },
        async jwt({ token, user, trigger, session }: any) {
            console.log("JWT Callback - User:", user);
            if (user) {
                token.id = user.id;
                token.role = user.role || "viewer";
            }

            // Handle manual role updates if needed
            if (trigger === "update" && session?.role) {
                token.role = session.role;
            }

            console.log("JWT Callback - Final Token:", token);
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
    secret: process.env.NEXTAUTH_SECRET,
};

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth(authOptions);

