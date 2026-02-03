import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import CV from "@/models/CV";
import { apiResponse, apiError, handleApiError } from "@/lib/auth";

/**
 * GET /api/cv
 * Public endpoint - Get the most recent CV
 */
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const cv = await CV.findOne()
            .sort({ uploadedAt: -1 })
            .lean();

        if (!cv) {
            return apiError("No CV available", 404);
        }

        return apiResponse(cv);
    } catch (error) {
        return handleApiError(error);
    }
}
