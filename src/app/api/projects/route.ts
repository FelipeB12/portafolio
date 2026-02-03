import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { projectQuerySchema } from "@/schemas";
import { apiResponse, apiError, handleApiError } from "@/lib/auth";

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
