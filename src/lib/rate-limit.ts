/**
 * Simple in-memory rate limiter for development
 * For production, use Redis or a dedicated rate limiting service
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
        if (entry.resetAt < now) {
            rateLimitMap.delete(key);
        }
    }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (e.g., IP address)
 * @param config - Rate limit configuration
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = {
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "5"),
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000"),
    }
): RateLimitResult {
    const now = Date.now();
    const entry = rateLimitMap.get(identifier);

    if (!entry || entry.resetAt < now) {
        // First request or window expired
        const resetAt = now + config.windowMs;
        rateLimitMap.set(identifier, { count: 1, resetAt });
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetAt,
        };
    }

    if (entry.count >= config.maxRequests) {
        // Rate limit exceeded
        return {
            allowed: false,
            remaining: 0,
            resetAt: entry.resetAt,
        };
    }

    // Increment count
    entry.count++;
    rateLimitMap.set(identifier, entry);

    return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetAt: entry.resetAt,
    };
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");

    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }

    if (realIp) {
        return realIp.trim();
    }

    return "unknown";
}
