import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCaseStudy from "@/components/ProjectCaseStudy";
import { siteConfig } from "@/config/site";
import { notFound } from "next/navigation";
import { Metadata } from "next";

async function getProject(slug: string) {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    try {
        const res = await fetch(`${baseUrl}/api/projects/${slug}`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.success ? json.data : null;
    } catch (error) {
        console.error("Error fetching project:", error);
        return null;
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) return { title: "Project Not Found" };

    return {
        title: `${project.title} | Projects | ${siteConfig.name}`,
        description: project.shortDescription,
        openGraph: {
            title: project.title,
            description: project.shortDescription,
            images: [project.screenshots[0]?.url || siteConfig.seo.ogImage],
            type: "website",
        },
    };
}

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-32 pb-24">
                <div className="container max-w-7xl mx-auto px-4">
                    <ProjectCaseStudy project={project} />
                </div>
            </main>

            <Footer />
        </div>
    );
}
