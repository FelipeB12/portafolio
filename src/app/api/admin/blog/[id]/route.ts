import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { blogPostUpdateSchema } from "@/schemas";
import {
    requireAdmin,
    apiResponse,
    apiError,
    handleApiError,
} from "@/lib/auth";

/**
 * PUT /api/admin/blog/[id]
 * Admin only - Update a blog post
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
        const validatedData = blogPostUpdateSchema.parse(body);

        // If slug is being updated, check for conflicts
        if (validatedData.slug) {
            const existing = await BlogPost.findOne({
                slug: validatedData.slug,
                _id: { $ne: id },
            });
            if (existing) {
                return apiError("A blog post with this slug already exists", 409);
            }
        }

        const post = await BlogPost.findByIdAndUpdate(
            id,
            validatedData,
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
 * DELETE /api/admin/blog/[id]
 * Admin only - Delete a blog post
 */
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        await connectDB();
        const { id } = await context.params;

        const post = await BlogPost.findByIdAndDelete(id);

        if (!post) {
            return apiError("Blog post not found", 404);
        }

        return apiResponse({ message: "Blog post deleted successfully" });
    } catch (error) {
        return handleApiError(error);
    }
}
