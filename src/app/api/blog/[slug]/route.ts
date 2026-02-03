import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { apiResponse, apiError, handleApiError, requireAdmin, isAdmin } from "@/lib/auth";
import { blogPostUpdateSchema } from "@/schemas";

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

        const isUserAdmin = await isAdmin();

        const filter: any = { slug };
        if (!isUserAdmin) {
            filter.publishedAt = { $lte: new Date() };
        }

        const post = await BlogPost.findOne(filter).lean();

        if (!post) {
            return apiError("Blog post not found", 404);
        }

        return apiResponse(post);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * PUT /api/blog/[slug]
 * Protected endpoint - Update an existing blog post
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
        const validatedData = blogPostUpdateSchema.parse(body);

        const post = await BlogPost.findOneAndUpdate(
            { slug },
            { $set: validatedData },
            { new: true, runValidators: true }
        );

        if (!post) {
            return apiError("Blog post not found", 404);
        }

        return apiResponse(post);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * DELETE /api/blog/[slug]
 * Protected endpoint - Delete a blog post
 */
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        await requireAdmin();
        await connectDB();
        const { slug } = await context.params;

        const post = await BlogPost.findOneAndDelete({ slug });

        if (!post) {
            return apiError("Blog post not found", 404);
        }

        return apiResponse({ message: "Blog post deleted successfully" });
    } catch (error) {
        return handleApiError(error);
    }
}
