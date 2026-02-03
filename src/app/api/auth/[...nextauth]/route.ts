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
        }),
    ],
    callbacks: {
        async session({ session, user }: any) {
            if (session.user) {
                // Connect to DB and fetch user role
                await connectDB();
                const dbUser = await User.findOne({ email: session.user.email });

                session.user.id = user.id;
                session.user.role = dbUser?.role || "viewer";
            }
            return session;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                token.role = user.role || "viewer";
            }
            return token;
        },
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    session: {
        strategy: "database",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth(authOptions);

