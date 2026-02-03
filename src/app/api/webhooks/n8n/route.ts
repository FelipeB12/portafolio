import { NextRequest } from "next/server";
import { apiResponse, apiError } from "@/lib/auth";

/**
 * POST /api/webhooks/n8n
 * Webhook endpoint for n8n automation
 * Validates webhook secret
 */
export async function POST(request: NextRequest) {
    try {
        // Verify webhook secret
        const secret = request.headers.get("X-Webhook-Secret");
        const expectedSecret = process.env.WEBHOOK_SECRET;

        if (!expectedSecret) {
            return apiError("Webhook not configured", 503);
        }

        if (secret !== expectedSecret) {
            return apiError("Invalid webhook secret", 401);
        }

        const body = await request.json();

        // Log the webhook payload
        console.log("n8n webhook received:", {
            type: body.type,
            timestamp: new Date().toISOString(),
        });

        // Process webhook based on type
        switch (body.type) {
            case "contact_form":
                // Handle contact form webhook
                console.log("Contact form webhook:", body.data);
                break;

            case "project_created":
            case "project_updated":
            case "project_deleted":
                // Handle project webhooks
                console.log("Project webhook:", body.data);
                break;

            case "blog_published":
                // Handle blog webhook
                console.log("Blog webhook:", body.data);
                break;

            default:
                console.log("Unknown webhook type:", body.type);
        }

        return apiResponse({
            received: true,
            type: body.type,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Webhook error:", error);
        return apiError("Webhook processing failed", 500);
    }
}
