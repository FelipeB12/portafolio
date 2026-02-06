import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth(async (req) => {
    const { pathname } = req.nextUrl;
    const session = req.auth;
    const isAuth = !!session;

    // Protect /dashboard routes and /api/admin routes
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/admin")) {
        // Not authenticated
        if (!isAuth) {
            if (pathname.startsWith("/api/admin")) {
                return NextResponse.json(
                    { success: false, error: "Authentication required" },
                    { status: 401 }
                );
            }
            // Redirect to sign-in for dashboard pages
            const signInUrl = new URL("/auth/signin", req.url);
            signInUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(signInUrl);
        }

        // Not admin
        if (session?.user?.role !== "admin") {
            if (pathname.startsWith("/api/admin")) {
                return NextResponse.json(
                    { success: false, error: "Forbidden: Admin access required" },
                    { status: 403 }
                );
            }
            // Redirect to home for dashboard pages
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/dashboard/:path*", "/api/admin/:path*"],
};
