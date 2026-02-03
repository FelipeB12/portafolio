import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { apiResponse, apiError, handleApiError } from "@/lib/auth";

/**
 * GET /api/projects/[slug]
 * Public endpoint - Get a single project by slug
 */
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await context.params;

        const project = await Project.findOne({ slug }).lean();

        if (!project) {
            return apiError("Project not found", 404);
        }

        return apiResponse(project);
    } catch (error) {
        return handleApiError(error);
    }
}
