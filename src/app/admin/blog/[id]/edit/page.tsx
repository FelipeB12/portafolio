import connectDB from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import BlogEditorWrapper from "./BlogEditorWrapper";
import { notFound } from "next/navigation";

async function getPost(id: string) {
    await connectDB();
    try {
        const post = await BlogPost.findById(id).lean();
        if (!post) return null;
        return JSON.parse(JSON.stringify(post)); // Serialize for client
    } catch {
        return null;
    }
}

export default async function EditBlogPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) {
        notFound();
    }

    return (
        <div className="max-w-6xl mx-auto">
            <BlogEditorWrapper post={post} />
        </div>
    );
}
