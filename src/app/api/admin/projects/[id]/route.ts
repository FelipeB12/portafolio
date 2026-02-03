import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { projectUpdateSchema } from "@/schemas";
import {
    requireAdmin,
    apiResponse,
    apiError,
    handleApiError,
} from "@/lib/auth";

/**
 * PUT /api/admin/projects/[id]
 * Admin only - Update a project
 */
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        await connectDB();
        const { id } = await context.params;

        const body = await request.json();
        const validatedData = projectUpdateSchema.parse(body);

        // If slug is being updated, check for conflicts
        if (validatedData.slug) {
            const existing = await Project.findOne({
                slug: validatedData.slug,
                _id: { $ne: id },
            });
            if (existing) {
                return apiError("A project with this slug already exists", 409);
            }
        }

        const project = await Project.findByIdAndUpdate(
            id,
            validatedData,
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
 * DELETE /api/admin/projects/[id]
 * Admin only - Delete a project
 */
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        await connectDB();
        const { id } = await context.params;

        const project = await Project.findByIdAndDelete(id);

        if (!project) {
            return apiError("Project not found", 404);
        }

        return apiResponse({ message: "Project deleted successfully" });
    } catch (error) {
        return handleApiError(error);
    }
}
