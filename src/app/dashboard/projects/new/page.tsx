"use client";

import ProjectEditor from "@/components/ProjectEditor";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewProjectPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async (data: any) => {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const json = await res.json();
            if (json.success) {
                router.push("/dashboard/projects");
                router.refresh();
            } else {
                alert("Error saving project: " + json.error);
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("Failed to save project");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <ProjectEditor onSave={handleSave} isSubmitting={isSubmitting} />
        </div>
    );
}
