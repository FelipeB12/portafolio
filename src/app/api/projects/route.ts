import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { projectQuerySchema, projectSchema } from "@/schemas";
import { apiResponse, apiError, handleApiError, requireAdmin } from "@/lib/auth";

/**
 * GET /api/projects
 * Public endpoint - List all projects with optional filtering
 */
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const query = projectQuerySchema.parse({
            featured: searchParams.get("featured"),
            limit: searchParams.get("limit"),
            skip: searchParams.get("skip"),
        });

        const filter: any = {};
        if (query.featured !== undefined) {
            filter.featured = query.featured;
        }

        const projects = await Project.find(filter)
            .sort({ createdAt: -1 })
            .limit(query.limit)
            .skip(query.skip)
            .lean();

        const total = await Project.countDocuments(filter);

        return apiResponse({
            projects,
            total,
            limit: query.limit,
            skip: query.skip,
        });
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * POST /api/projects
 * Protected endpoint - Create a new project
 */
export async function POST(request: NextRequest) {
    try {
        await requireAdmin();
        await connectDB();

        const body = await request.json();
        const validatedData = projectSchema.parse(body);

        // Check if slug already exists
        const existingProject = await Project.findOne({ slug: validatedData.slug });
        if (existingProject) {
            return apiError("A project with this slug already exists", 400);
        }

        const project = await Project.create(validatedData);

        return apiResponse(project, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
