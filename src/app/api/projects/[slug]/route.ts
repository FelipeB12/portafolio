import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { projectUpdateSchema } from "@/schemas";
import { apiResponse, apiError, handleApiError, requireAdmin } from "@/lib/auth";

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

/**
 * PUT /api/projects/[slug]
 * Protected endpoint - Update an existing project
 */
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        await requireAdmin();
        await connectDB();
        const { slug } = await context.params;

        const body = await request.json();
        const validatedData = projectUpdateSchema.parse(body);

        const project = await Project.findOneAndUpdate(
            { slug },
            { $set: validatedData },
            { new: true, runValidators: true }
        );

        if (!project) {
            return apiError("Project not found", 404);
        }

        return apiResponse(project);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * DELETE /api/projects/[slug]
 * Protected endpoint - Delete a project
 */
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        await requireAdmin();
        await connectDB();
        const { slug } = await context.params;

        const project = await Project.findOneAndDelete({ slug });

        if (!project) {
            return apiError("Project not found", 404);
        }

        return apiResponse({ message: "Project deleted successfully" });
    } catch (error) {
        return handleApiError(error);
    }
}
