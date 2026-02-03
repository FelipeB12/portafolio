"use client";

import BlogEditor from "@/components/BlogEditor";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BlogEditorWrapper({ post }: { post: any }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async (data: any) => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/blog/${post.slug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const json = await res.json();
            if (json.success) {
                router.push("/admin/blog");
                router.refresh();
            } else {
                alert("Error updating post: " + json.error);
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update post");
        } finally {
            setIsSubmitting(false);
        }
    };

    return <BlogEditor initialData={post} onSave={handleSave} isSubmitting={isSubmitting} />;
}
