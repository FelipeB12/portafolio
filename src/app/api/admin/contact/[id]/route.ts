import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import {
    requireAdmin,
    apiResponse,
    apiError,
    handleApiError,
} from "@/lib/auth";

/**
 * PATCH /api/admin/contact/[id]
 * Admin only - Update contact message status
 */
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        await connectDB();
        const { id } = await context.params;

        const body = await request.json();
        const { processed } = body;

        if (typeof processed !== "boolean") {
            return apiError("Invalid processed status", 400);
        }

        const message = await ContactMessage.findByIdAndUpdate(
            id,
            { processed },
            { new: true }
        );

        if (!message) {
            return apiError("Contact message not found", 404);
        }

        return apiResponse(message);
    } catch (error) {
        return handleApiError(error);
    }
}
