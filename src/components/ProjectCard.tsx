import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
    project: {
        _id: string;
        title: string;
        slug: string;
        shortDescription: string;
        techStack: string[];
        screenshots: { url: string; alt: string }[];
        githubLink?: string;
        liveLink?: string;
    };
    className?: string;
}

export default function ProjectCard({ project, className }: ProjectCardProps) {
    const mainImage = project.screenshots[0]?.url || "https://placehold.co/600x400/png?text=No+Image";

    return (
        <div
            className={cn(
                "group relative flex flex-col bg-card rounded-[2.5rem] border border-border overflow-hidden transition-all hover:shadow-2xl hover:border-brand-red/50 hover:translate-y-[-4px] h-full",
                className
            )}
        >
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={mainImage}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div className="flex gap-4">
                        {project.liveLink && (
                            <a
                                href={project.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white rounded-full text-gray-900 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                aria-label="Live Demo"
                            >
                                <ArrowUpRight size={20} />
                            </a>
                        )}
                        {project.githubLink && (
                            <a
                                href={project.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white rounded-full text-gray-900 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                                aria-label="GitHub Repository"
                            >
                                <Github size={20} />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 3).map((tech) => (
                        <span
                            key={tech}
                            className="text-[10px] uppercase tracking-widest font-black px-2 py-1 bg-brand-red/10 text-brand-red rounded-lg"
                        >
                            {tech}
                        </span>
                    ))}
                    {project.techStack.length > 3 && (
                        <span className="text-[10px] uppercase font-bold text-gray-400">+{project.techStack.length - 3}</span>
                    )}
                </div>

                <h3 className="text-xl font-black mb-2 font-display group-hover:text-brand-red transition-colors">
                    <Link href={`/projects/${project.slug}`}>
                        {project.title}
                    </Link>
                </h3>
                <p className="text-muted-text text-sm line-clamp-3 mb-6 flex-grow">
                    {project.shortDescription}
                </p>

                <Link
                    href={`/projects/${project.slug}`}
                    className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-brand-red hover:text-brand-red-hover transition-all"
                >
                    Case Study <ArrowUpRight size={14} />
                </Link>
            </div>
        </div>
    );
}
