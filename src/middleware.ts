import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /dashboard routes and /api/admin routes
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/admin")) {
        const token = await getToken({
            req: request,
            secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
            secureCookie: process.env.NODE_ENV === "production",
        });

        console.log(`[Middleware] Path: ${pathname}, Token exists: ${!!token}, Role: ${token?.role || "none"}`);

        // Not authenticated
        if (!token) {
            console.log(`[Middleware] No token found, redirecting to sign-in`);
            if (pathname.startsWith("/api/admin")) {
                return NextResponse.json(
                    { success: false, error: "Authentication required" },
                    { status: 401 }
                );
            }
            // Redirect to sign-in for dashboard pages
            const signInUrl = new URL("/auth/signin", request.url);
            signInUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(signInUrl);
        }

        // Not admin
        if (token.role !== "admin") {
            console.log(`[Middleware] User role is ${token.role}, not admin. Redirecting to home.`);
            if (pathname.startsWith("/api/admin")) {
                return NextResponse.json(
                    { success: false, error: "Forbidden: Admin access required" },
                    { status: 403 }
                );
            }
            // Redirect to home for dashboard pages
            return NextResponse.redirect(new URL("/", request.url));
        }

        console.log(`[Middleware] Admin access granted for ${pathname}`);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/api/admin/:path*"],
};
