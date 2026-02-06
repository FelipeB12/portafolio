import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import About from "@/models/About";
import { apiResponse, apiError, handleApiError, requireAdmin } from "@/lib/auth";

/**
 * GET /api/about
 * Public endpoint - Get the latest About profile
 */
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const about = await About.findOne().sort({ updatedAt: -1 }).lean();

        if (!about) {
            return apiError("No profile information found", 404);
        }

        return apiResponse(about);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * POST /api/about
 * Admin endpoint - Update or create the profile
 */
export async function POST(request: NextRequest) {
    try {
        const session = await requireAdmin();
        await connectDB();

        const data = await request.json();
        const { title, bio, imageUrl, skills } = data;

        if (!title || !bio) {
            return apiError("Title and bio are required", 400);
        }

        // Upsert logic: Update the existing one or create a new one
        const updatedAbout = await About.findOneAndUpdate(
            {}, // Match anything (since we usually only have one)
            {
                title,
                bio,
                imageUrl,
                skills,
                updatedBy: session.user.id,
                updatedAt: new Date(),
            },
            { upsert: true, new: true, runValidators: true }
        );

        return apiResponse(updatedAbout, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
