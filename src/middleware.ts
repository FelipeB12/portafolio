import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /admin routes and /api/admin routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        });

        // Not authenticated
        if (!token) {
            if (pathname.startsWith("/api/admin")) {
                return NextResponse.json(
                    { success: false, error: "Authentication required" },
                    { status: 401 }
                );
            }
            // Redirect to sign-in for admin pages
            const signInUrl = new URL("/auth/signin", request.url);
            signInUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(signInUrl);
        }

        // Not admin
        if (token.role !== "admin") {
            if (pathname.startsWith("/api/admin")) {
                return NextResponse.json(
                    { success: false, error: "Forbidden: Admin access required" },
                    { status: 403 }
                );
            }
            // Redirect to home for admin pages
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};
