import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { blogPostSchema } from "@/schemas";
import {
    requireAdmin,
    apiResponse,
    apiError,
    handleApiError,
} from "@/lib/auth";

/**
 * POST /api/admin/blog
 * Admin only - Create a new blog post
 */
export async function POST(request: NextRequest) {
    try {
        await requireAdmin();
        await connectDB();

        const body = await request.json();
        const validatedData = blogPostSchema.parse(body);

        // Check if slug already exists
        const existing = await BlogPost.findOne({ slug: validatedData.slug });
        if (existing) {
            return apiError("A blog post with this slug already exists", 409);
        }

        const post = await BlogPost.create(validatedData);

        return apiResponse(post, 201);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * GET /api/admin/blog
 * Admin only - List all blog posts (including unpublished)
 */
export async function GET(request: NextRequest) {
    try {
        await requireAdmin();
        await connectDB();

        const posts = await BlogPost.find({})
            .sort({ createdAt: -1 })
            .lean();

        return apiResponse({ posts, total: posts.length });
    } catch (error) {
        return handleApiError(error);
    }
}
