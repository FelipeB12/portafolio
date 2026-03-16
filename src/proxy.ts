import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;
    const role = req.auth?.user?.role;

    // Protect /dashboard routes and /api/admin routes
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/admin")) {
        console.log(`[Proxy] Path: ${pathname}, Logged in: ${isLoggedIn}, Role: ${role || "none"}`);

        // Not authenticated
        if (!isLoggedIn) {
            console.log(`[Proxy] No session found, redirecting to sign-in`);
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
        if (role !== "admin") {
            console.log(`[Proxy] User role is ${role}, not admin. Redirecting to home.`);
            if (pathname.startsWith("/api/admin")) {
                return NextResponse.json(
                    { success: false, error: "Forbidden: Admin access required" },
                    { status: 403 }
                );
            }
            // Redirect to home for dashboard pages
            return NextResponse.redirect(new URL("/", req.url));
        }

        console.log(`[Proxy] Admin access granted for ${pathname}`);
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/dashboard/:path*", "/api/admin/:path*"],
};
