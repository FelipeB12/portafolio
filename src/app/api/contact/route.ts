import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { contactMessageSchema } from "@/schemas";
import { apiResponse, apiError, handleApiError } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { uploadFile } from "@/lib/upload";
// import { sendEmail } from "@/lib/email"; // Temporarily disabled - no email provider configured
import { triggerWebhook } from "@/lib/webhooks";

/**
 * POST /api/contact
 * Public endpoint - Submit a contact form
 * Includes rate limiting, honeypot, email notifications, and webhooks
 */
export async function POST(request: NextRequest) {
    try {
        // 1. Rate limiting check
        const clientIp = getClientIp(request);
        const rateLimitResult = checkRateLimit(clientIp);

        if (!rateLimitResult.allowed) {
            return apiError("Too many requests. Please try again later.", 429);
        }

        await connectDB();

        // 2. Parse FormData for attachments and fields
        const formData = await request.formData();

        const rawData = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            message: formData.get("message") as string,
            projectBudget: (formData.get("projectBudget") as string) || undefined,
            website: (formData.get("website") as string) || undefined, // Honeypot
        };

        const file = formData.get("attachment") as File | null;

        // 3. Validate Basic Fields
        // We validate without the file object first if it's sent as a separate part
        const validatedData = contactMessageSchema.omit({ file: true }).parse(rawData);

        // 4. Honeypot check
        if (rawData.website && rawData.website.length > 0) {
            console.log("🤖 Bot detected via honeypot field");
            return apiResponse({ message: "Thank you for your message!" });
        }

        // 5. Handle File Attachment
        let fileData = undefined;
        if (file && file.size > 0) {
            // Validate size (5MB max for contacts)
            if (file.size > 5 * 1024 * 1024) {
                return apiError("Attachment size exceeds 5MB limit", 400);
            }

            const uploadResult = await uploadFile(file, "contacts");
            fileData = {
                url: uploadResult.url,
                name: file.name
            };
        }

        // 6. Save to Database
        const message = await ContactMessage.create({
            ...validatedData,
            file: fileData,
        });

        // 7. Send Email Notification (Async) - TEMPORARILY DISABLED
        // TODO: Re-enable when email provider is configured
        /*
        sendEmail({
            to: process.env.SMTP_USER || "admin@portfolio.com",
            subject: `New Contact Message: ${message.name}`,
            text: `Name: ${message.name}\nEmail: ${message.email}\nBudget: ${message.projectBudget || "N/A"}\nMessage: ${message.message}\nAttachment: ${fileData?.url || "None"}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
                    <h2 style="color: #2563eb;">New Portfolio Inquiry</h2>
                    <p><strong>From:</strong> ${message.name} (${message.email})</p>
                    <p><strong>Budget:</strong> ${message.projectBudget || "Not specified"}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="white-space: pre-wrap;">${message.message}</p>
                    ${fileData ? `<p style="margin-top: 20px;"><a href="${fileData.url}" style="color: #2563eb; font-weight: bold;">View Attachment</a></p>` : ""}
                </div>
            `
        }).catch(err => console.error("Email notification failed:", err));
        */

        // 8. Trigger n8n Webhook (Async)
        triggerWebhook("contact", {
            id: message._id,
            name: message.name,
            email: message.email,
            message: message.message,
            projectBudget: message.projectBudget,
            attachmentUrl: fileData?.url,
            createdAt: message.createdAt,
        }).catch(err => console.error("Webhook trigger failed:", err));

        return apiResponse({
            message: "Thank you! Your message has been sent successfully.",
            id: message._id
        }, 201);

    } catch (error) {
        return handleApiError(error);
    }
}
