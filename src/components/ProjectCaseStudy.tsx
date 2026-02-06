import Image from "next/image";
import { ArrowUpRight, Github, Code, Target, Lightbulb, User, CheckCircle2 } from "lucide-react";
import ProjectGallery from "./ProjectGallery";

interface ProjectCaseStudyProps {
    project: {
        title: string;
        shortDescription: string;
        problem: string;
        solution: string;
        role: string;
        techStack: string[];
        keyDecisions: string[];
        screenshots: { url: string; alt?: string }[];
        liveLink?: string;
        githubLink?: string;
    };
}

export default function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
    return (
        <div className="space-y-24">
            {/* Hero Section */}
            <section className="space-y-12">
                <div className="space-y-6">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-loose ">{project.title}</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                        {project.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        {project.liveLink && (
                            <a
                                href={project.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-red text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-brand-red-hover transition-all shadow-xl shadow-brand-red/20"
                            >
                                Live Demo <ArrowUpRight size={20} />
                            </a>
                        )}
                        {project.githubLink && (
                            <a
                                href={project.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                            >
                                View Source <Github size={20} />
                            </a>
                        )}
                    </div>
                </div>

                {project.screenshots[0] && (
                    <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800">
                        <Image
                            src={project.screenshots[0].url}
                            alt={project.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}
            </section>

            {/* Grid Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32">
                {/* Left Column: Problem & Solution */}
                <div className="space-y-16">
                    <section className="space-y-6">
                        <h2 className="text-3xl font-bold flex items-center gap-3">
                            <Target className="text-red-500" />
                            The Problem
                        </h2>
                        <div className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                            {project.problem}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-3xl font-bold flex items-center gap-3">
                            <Lightbulb className="text-amber-500" />
                            The Solution
                        </h2>
                        <div className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                            {project.solution}
                        </div>
                    </section>
                </div>

                {/* Right Column: Role & Tech Stack */}
                <div className="space-y-16">
                    <section className="space-y-6">
                        <h2 className="text-3xl font-bold flex items-center gap-3">
                            <User className="text-brand-red" />
                            My Role
                        </h2>
                        <div className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                            {project.role}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-3xl font-bold flex items-center gap-3">
                            <Code className="text-purple-500" />
                            Tech Stack
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-semibold"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Key Decisions */}
            <section className="p-12 bg-brand-red/5 rounded-[3rem] border border-brand-red/10 space-y-8">
                <h2 className="text-3xl font-black uppercase font-display tracking-tight flex items-center gap-3">
                    <CheckCircle2 className="text-brand-gold" />
                    Key Decisions
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.keyDecisions.map((decision, index) => (
                        <li key={index} className="flex gap-4 group">
                            <div className="w-8 h-8 rounded-full bg-brand-red/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-red transition-colors border border-brand-red/20">
                                <span className="text-xs font-black text-brand-red group-hover:text-white">{index + 1}</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {decision}
                            </p>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Gallery */}
            <section className="space-y-12">
                <h2 className="text-3xl font-bold">Screenshot Gallery</h2>
                <ProjectGallery screenshots={project.screenshots} />
            </section>
        </div>
    );
}
