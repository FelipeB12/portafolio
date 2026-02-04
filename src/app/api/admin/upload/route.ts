import { NextRequest } from "next/server";
import {
    requireAdmin,
    apiResponse,
    apiError,
    handleApiError,
} from "@/lib/auth";
import { uploadFile } from "@/lib/upload";

/**
 * POST /api/admin/upload
 * Admin only - Upload files (images or PDFs)
 * Returns Cloudinary URL or local URL in development
 */
export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return apiError("No file provided", 400);
        }

        // Validate file type
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "application/pdf",
        ];

        if (!allowedTypes.includes(file.type)) {
            return apiError("Invalid file type. Only images and PDFs are allowed.", 400);
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return apiError("File size exceeds 10MB limit", 400);
        }

        // Use the common upload utility
        const result = await uploadFile(file);

        return apiResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}
