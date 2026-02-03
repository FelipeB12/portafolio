import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import CV from "@/models/CV";
import { cvSchema } from "@/schemas";
import {
    requireAdmin,
    apiResponse,
    apiError,
    handleApiError,
} from "@/lib/auth";

/**
 * POST /api/admin/cv
 * Admin only - Upload a new CV
 */
export async function POST(request: NextRequest) {
    try {
        const session = await requireAdmin();
        await connectDB();

        const body = await request.json();
        const validatedData = cvSchema.parse(body);

        const cv = await CV.create({
            ...validatedData,
            uploadedBy: session.user.id,
        });

        return apiResponse(cv, 201);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * GET /api/admin/cv
 * Admin only - List all CVs
 */
export async function GET(request: NextRequest) {
    try {
        await requireAdmin();
        await connectDB();

        const cvs = await CV.find({})
            .sort({ uploadedAt: -1 })
            .populate("uploadedBy", "name email")
            .lean();

        return apiResponse({ cvs, total: cvs.length });
    } catch (error) {
        return handleApiError(error);
    }
}
