import { NextRequest } from "next/server";
import { apiResponse, apiError, handleApiError } from "@/lib/auth";
import crypto from "crypto";

/**
 * POST /api/webhooks/n8n
 * Webhook endpoint for n8n automation
 * Validates HMAC-SHA256 signature
 */
export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();
        const signature = request.headers.get("x-webhook-signature");
        const secret = process.env.WEBHOOK_SECRET;

        console.log("📥 [MOCK WEBHOOK] Received payload:", JSON.stringify(payload, null, 2));

        if (secret) {
            if (!signature) {
                console.error("❌ [MOCK WEBHOOK] Missing signature header!");
                return apiError("Missing signature", 401);
            }

            const expectedSignature = crypto
                .createHmac("sha256", secret)
                .update(JSON.stringify(payload))
                .digest("hex");

            if (signature !== expectedSignature) {
                console.error("❌ [MOCK WEBHOOK] Invalid signature!");
                console.error("Expected:", expectedSignature);
                console.error("Received:", signature);
                return apiError("Invalid signature", 401);
            }
            console.log("✅ [MOCK WEBHOOK] Signature verified!");
        } else {
            console.warn("⚠️ [MOCK WEBHOOK] WEBHOOK_SECRET not configured. Skipping verification.");
        }

        // Process based on type (for testing visibility)
        console.log(`🚀 [MOCK WEBHOOK] Processing type: ${payload.type}`);

        return apiResponse({
            received: true,
            type: payload.type,
            verified: !!secret
        });
    } catch (error) {
        return handleApiError(error);
    }
}
