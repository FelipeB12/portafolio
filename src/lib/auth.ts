
/**
 * Get the current authenticated session
 * NOTE: This is a placeholder for next-auth@beta
 * In production, implement proper session retrieval
 */
export async function getSession(): Promise<unknown> {
    // TODO: Implement with next-auth@beta auth() function
    return null;
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<{ user: { role: string; id: string; email: string; name: string } }> {
    const session = await getSession() as { user: { role: string; id: string; email: string; name: string } } | null;

    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    return session;
}

/**
 * Require admin role - throws if not admin
 */
export async function requireAdmin(): Promise<{ user: { role: string; id: string; email: string; name: string } }> {
    const session = await requireAuth();

    if (session.user.role !== "admin") {
        throw new Error("Forbidden: Admin access required");
    }

    return session;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
    try {
        const session = await getSession() as { user: { role: string } } | null;
        return session?.user?.role === "admin";
    } catch {
        return false;
    }
}

/**
 * API response helper
 */
export function apiResponse<T>(data: T, status: number = 200): Response {
    return Response.json(
        {
            success: true,
            data,
        },
        { status }
    );
}

/**
 * API error response helper
 */
export function apiError(error: string, status: number = 400): Response {
    return Response.json(
        {
            success: false,
            error,
        },
        { status }
    );
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown): Response {
    console.error("API Error:", error);

    if (error instanceof Error) {
        if (error.message === "Unauthorized") {
            return apiError("Authentication required", 401);
        }
        if (error.message.startsWith("Forbidden")) {
            return apiError(error.message, 403);
        }
        return apiError(error.message, 400);
    }

    return apiError("Internal server error", 500);
}

// Extend NextAuth types
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            role: "admin" | "editor" | "viewer";
        };
    }

    interface User {
        role: "admin" | "editor" | "viewer";
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: "admin" | "editor" | "viewer";
    }
}
