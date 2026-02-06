import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb-adapter";

export const authOptions: NextAuthConfig = {
    adapter: MongoDBAdapter(clientPromise) as any,
    debug: process.env.NODE_ENV === "development",
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID || process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET || process.env.AUTH_GITHUB_SECRET,
        }),
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
        async session({ session, token }: any) {
            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.role = token.role as "admin" | "editor" | "viewer";
            }
            return session;
        },
        async jwt({ token, user, trigger, session }: any) {
            // Initial sign in - get user data from adapter
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }

            // ALWAYS check database for the latest role on every request
            // This ensures manual promotions work and role is always current
            try {
                const client = await clientPromise;
                const db = client.db();
                const dbUser = await db.collection("users").findOne({
                    email: token.email
                });

                if (dbUser && dbUser.role) {
                    token.role = dbUser.role;
                    console.log(`[JWT] Role set for ${token.email}: ${token.role}`);
                } else {
                    token.role = "viewer";
                    console.log(`[JWT] No role found for ${token.email}, defaulting to viewer`);
                }
            } catch (error) {
                console.error("[JWT] Error fetching role from DB:", error);
                token.role = token.role || "viewer";
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
