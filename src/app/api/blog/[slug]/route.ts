import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { apiResponse, apiError, handleApiError } from "@/lib/auth";

/**
 * GET /api/blog/[slug]
 * Public endpoint - Get a single published blog post by slug
 */
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await context.params;

        const post = await BlogPost.findOne({
            slug,
            publishedAt: { $lte: new Date() },
        }).lean();

        if (!post) {
            return apiError("Blog post not found", 404);
        }

        return apiResponse(post);
    } catch (error) {
        return handleApiError(error);
    }
}
