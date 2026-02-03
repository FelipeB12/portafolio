import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { projectSchema } from "@/schemas";
import {
    requireAdmin,
    apiResponse,
    apiError,
    handleApiError,
} from "@/lib/auth";

/**
 * POST /api/admin/projects
 * Admin only - Create a new project
 */
export async function POST(request: NextRequest) {
    try {
        await requireAdmin();
        await connectDB();

        const body = await request.json();
        const validatedData = projectSchema.parse(body);

        // Check if slug already exists
        const existing = await Project.findOne({ slug: validatedData.slug });
        if (existing) {
            return apiError("A project with this slug already exists", 409);
        }

        const project = await Project.create(validatedData);

        return apiResponse(project, 201);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * GET /api/admin/projects
 * Admin only - List all projects (including unpublished)
 */
export async function GET(request: NextRequest) {
    try {
        await requireAdmin();
        await connectDB();

        const projects = await Project.find({})
            .sort({ createdAt: -1 })
            .lean();

        return apiResponse({ projects, total: projects.length });
    } catch (error) {
        return handleApiError(error);
    }
}
