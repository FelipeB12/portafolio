import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: `Projects | ${siteConfig.name}`,
    description: "A showcase of my recent work in web development, DevOps, and software architecture.",
};

async function getProjects(featured?: boolean, page = 1) {
    const limit = 6;
    const skip = (page - 1) * limit;
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const url = new URL(`${baseUrl}/api/projects`);
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("skip", skip.toString());
    if (featured) url.searchParams.set("featured", "true");

    try {
        const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
        if (!res.ok) return { projects: [], total: 0 };
        const json = await res.json();
        return json.success ? json.data : { projects: [], total: 0 };
    } catch (error) {
        console.error("Error fetching projects:", error);
        return { projects: [], total: 0 };
    }
}

export default async function ProjectsPage({
    searchParams,
}: {
    searchParams: Promise<{ featured?: string; page?: string }>;
}) {
    const params = await searchParams;
    const featured = params.featured === "true";
    const page = parseInt(params.page || "1");

    const { projects, total } = await getProjects(featured, page);
    const totalPages = Math.ceil(total / 6);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-32 pb-24">
                <div className="container max-w-7xl mx-auto px-4">
                    <header className="mb-24 text-center max-w-4xl mx-auto">
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter font-display uppercase leading-[1.1]">
                            Curated <span className="text-brand-red">Work</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-text max-w-3xl mx-auto font-medium mt-8 leading-relaxed">
                            Explore my portfolio of projects ranging from <span className="text-gray-900 dark:text-white font-bold">full-stack applications</span> to performance-critical systems.
                        </p>
                    </header>

                    {/* Filters */}
                    <div className="flex justify-center gap-4 mb-20">
                        <Link
                            href="/projects"
                            className={cn(
                                "px-8 py-3 rounded-2xl text-sm font-bold transition-all border shadow-sm",
                                !featured
                                    ? "bg-brand-red border-brand-red text-white shadow-brand-red/20"
                                    : "bg-card border-border text-muted-text hover:border-brand-red/50"
                            )}
                        >
                            All Projects
                        </Link>
                        <Link
                            href="/projects?featured=true"
                            className={cn(
                                "px-8 py-3 rounded-2xl text-sm font-bold transition-all border shadow-sm",
                                featured
                                    ? "bg-brand-red border-brand-red text-white shadow-brand-red/20"
                                    : "bg-card border-border text-muted-text hover:border-brand-red/50"
                            )}
                        >
                            Featured Only
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
                        {projects.map((project: any) => (
                            <ProjectCard key={project._id} project={project} />
                        ))}
                        {projects.length === 0 && (
                            <div className="col-span-full py-40 text-center bg-gray-50/50 dark:bg-gray-900/50 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                                <p className="text-gray-400 text-xl font-medium">No projects found for the selected criteria.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-3">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <Link
                                    key={i}
                                    href={`/projects?page=${i + 1}${featured ? `&featured=true` : ""}`}
                                    className={cn(
                                        "w-14 h-14 flex items-center justify-center rounded-2xl font-bold transition-all border shadow-sm",
                                        page === i + 1
                                            ? "bg-brand-red border-brand-red text-white shadow-brand-red/20"
                                            : "bg-card border-border text-muted-text hover:border-brand-red/50"
                                    )}
                                >
                                    {i + 1}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
