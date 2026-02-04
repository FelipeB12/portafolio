"use client";

import ProjectEditor from "@/components/ProjectEditor";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProjectEditorWrapper({ project }: { project: any }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async (data: any) => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/projects/${project.slug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const json = await res.json();
            if (json.success) {
                router.push("/dashboard/projects");
                router.refresh();
            } else {
                alert("Error updating project: " + json.error);
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update project");
        } finally {
            setIsSubmitting(false);
        }
    };

    return <ProjectEditor initialData={project} onSave={handleSave} isSubmitting={isSubmitting} />;
}
