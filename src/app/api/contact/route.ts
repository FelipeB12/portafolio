import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { contactMessageSchema } from "@/schemas";
import { apiResponse, apiError, handleApiError } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * POST /api/contact
 * Public endpoint - Submit a contact form
 * Includes rate limiting and honeypot protection
 */
export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const clientIp = getClientIp(request);
        const rateLimit = checkRateLimit(clientIp);

        if (!rateLimit.allowed) {
            return apiError(
                "Too many requests. Please try again later.",
                429
            );
        }

        await connectDB();

        const body = await request.json();
        const validatedData = contactMessageSchema.parse(body);

        // Honeypot check
        if (validatedData.website && validatedData.website.length > 0) {
            // Bot detected - silently succeed
            return apiResponse({ message: "Message received" }, 200);
        }

        // Remove honeypot field before saving
        const { website, ...dataToSave } = validatedData;

        const message = await ContactMessage.create(dataToSave);

        // TODO: Send email notification
        // TODO: Call n8n webhook

        // Call webhook asynchronously (don't await)
        if (process.env.N8N_WEBHOOK_URL) {
            fetch(process.env.N8N_WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Webhook-Secret": process.env.WEBHOOK_SECRET || "",
                },
                body: JSON.stringify({
                    type: "contact_form",
                    data: {
                        id: message._id,
                        name: message.name,
                        email: message.email,
                        message: message.message,
                        projectBudget: message.projectBudget,
                        createdAt: message.createdAt,
                    },
                }),
            }).catch((err) => console.error("Webhook error:", err));
        }

        return apiResponse(
            {
                message: "Thank you for your message! We'll get back to you soon.",
                id: message._id,
            },
            201
        );
    } catch (error) {
        return handleApiError(error);
    }
}
