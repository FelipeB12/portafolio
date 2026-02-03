"use client";

import BlogEditor from "@/components/BlogEditor";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewBlogPostPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async (data: any) => {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/blog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, publishedAt: new Date() }), // Auto-publish for now
            });

            const json = await res.json();
            if (json.success) {
                router.push("/admin/blog");
                router.refresh();
            } else {
                alert("Error saving post: " + json.error);
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("Failed to save post");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <BlogEditor onSave={handleSave} isSubmitting={isSubmitting} />
        </div>
    );
}
