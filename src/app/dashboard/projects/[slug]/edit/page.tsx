import connectDB from "@/lib/db";
import Project from "@/models/Project";
import ProjectEditorWrapper from "./ProjectEditorWrapper";
import { notFound } from "next/navigation";

async function getProjectBySlug(slug: string) {
    await connectDB();
    try {
        const project = await Project.findOne({ slug }).lean();
        if (!project) return null;
        return JSON.parse(JSON.stringify(project)); // Serialize for client
    } catch {
        return null;
    }
}

export default async function EditProjectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="max-w-7xl mx-auto">
            <ProjectEditorWrapper project={project} />
        </div>
    );
}
