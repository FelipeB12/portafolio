import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { blogQuerySchema } from "@/schemas";
import { apiResponse, apiError, handleApiError } from "@/lib/auth";

/**
 * GET /api/blog
 * Public endpoint - List published blog posts
 */
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const query = blogQuerySchema.parse({
            tag: searchParams.get("tag") || undefined,
            published: searchParams.get("published") || undefined,
            limit: searchParams.get("limit") || undefined,
            skip: searchParams.get("skip") || undefined,
        });

        const filter: any = {};

        // Only show published posts by default
        if (query.published !== false) {
            filter.publishedAt = { $lte: new Date() };
        }

        if (query.tag) {
            filter.tags = query.tag;
        }

        const posts = await BlogPost.find(filter)
            .sort({ publishedAt: -1, createdAt: -1 })
            .limit(query.limit)
            .skip(query.skip)
            .lean();

        const total = await BlogPost.countDocuments(filter);

        return apiResponse({
            posts,
            total,
            limit: query.limit,
            skip: query.skip,
        });
    } catch (error) {
        return handleApiError(error);
    }
}
