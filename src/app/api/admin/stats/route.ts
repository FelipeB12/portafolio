import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import BlogPost from "@/models/BlogPost";
import ContactMessage from "@/models/ContactMessage";
import { requireAdmin, apiResponse, handleApiError } from "@/lib/auth";

/**
 * GET /api/admin/stats
 * Admin only - Get aggregate statistics for the dashboard
 */
export async function GET(request: NextRequest) {
    try {
        await requireAdmin();
        await connectDB();

        const [projectCount, blogCount, messageCount, unreadMessages] = await Promise.all([
            Project.countDocuments(),
            BlogPost.countDocuments(),
            ContactMessage.countDocuments(),
            ContactMessage.countDocuments({ processed: false }),
        ]);

        // Get latest activity (last 5 items across all collections)
        const [recentProjects, recentPosts, recentMessages] = await Promise.all([
            Project.find().sort({ createdAt: -1 }).limit(3).lean(),
            BlogPost.find().sort({ createdAt: -1 }).limit(3).lean(),
            ContactMessage.find().sort({ createdAt: -1 }).limit(3).lean(),
        ]);

        const recentActivity = [
            ...recentProjects.map(p => ({ type: 'project', title: p.title, date: p.createdAt, id: p.slug })),
            ...recentPosts.map(p => ({ type: 'post', title: p.title, date: p.createdAt, id: p.slug })),
            ...recentMessages.map(m => ({ type: 'message', title: `Message from ${m.name}`, date: m.createdAt, id: m._id })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

        return apiResponse({
            counts: {
                projects: projectCount,
                posts: blogCount,
                messages: messageCount,
                unread: unreadMessages
            },
            recentActivity
        });
    } catch (error) {
        return handleApiError(error);
    }
}
