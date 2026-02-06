import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import CV from "@/models/CV";
import { apiResponse, apiError, handleApiError, requireAdmin } from "@/lib/auth";
import { uploadFile } from "@/lib/upload";

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

/**
 * POST /api/cv
 * Admin endpoint - Upload a new CV
 */
export async function POST(request: NextRequest) {
    try {
        const session = await requireAdmin();
        await connectDB();

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return apiError("No file provided", 400);
        }

        // Validate file type (PDF only for CV)
        if (file.type !== "application/pdf") {
            return apiError("Invalid file type. Only PDFs are allowed for CV.", 400);
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return apiError("File size exceeds 5MB limit", 400);
        }

        // Upload file
        const uploadResult = await uploadFile(file, "cvs");

        // Save to DB
        const newCv = await CV.create({
            fileUrl: uploadResult.url,
            publicId: uploadResult.publicId, // Save the publicId
            fileName: file.name,
            uploadedBy: session.user.id,
        });

        return apiResponse(newCv, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
