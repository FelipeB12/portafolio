import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import {
    requireAdmin,
    apiResponse,
    handleApiError,
} from "@/lib/auth";

/**
 * GET /api/admin/contact
 * Admin only - List all contact messages
 */
export async function GET(request: NextRequest) {
    try {
        await requireAdmin();
        await connectDB();

        const { searchParams } = new URL(request.url);
        const processed = searchParams.get("processed");

        const filter: Record<string, unknown> = {};
        if (processed !== null) {
            filter.processed = processed === "true";
        }

        const messages = await ContactMessage.find(filter)
            .sort({ createdAt: -1 })
            .lean();

        return apiResponse({ messages, total: messages.length });
    } catch (error) {
        return handleApiError(error);
    }
}
