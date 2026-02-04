"use client";

import { useState, useRef } from "react";
import { Upload, X, Plus, Trash2, Image as ImageIcon, ExternalLink, Github, Monitor, Target, Lightbulb, User, Code, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import slugify from "slugify";

interface ProjectEditorProps {
    initialData?: any;
    onSave: (data: any) => Promise<void>;
    isSubmitting: boolean;
}

export default function ProjectEditor({ initialData, onSave, isSubmitting }: ProjectEditorProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
    const [problem, setProblem] = useState(initialData?.problem || "");
    const [solution, setSolution] = useState(initialData?.solution || "");
    const [role, setRole] = useState(initialData?.role || "");
    const [techStack, setTechStack] = useState<string[]>(initialData?.techStack || []);
    const [keyDecisions, setKeyDecisions] = useState<string[]>(initialData?.keyDecisions || []);
    const [screenshots, setScreenshots] = useState<any[]>(initialData?.screenshots || []);
    const [liveLink, setLiveLink] = useState(initialData?.liveLink || "");
    const [githubLink, setGithubLink] = useState(initialData?.githubLink || "");
    const [featured, setFeatured] = useState(initialData?.featured || false);

    const [currentTech, setCurrentTech] = useState("");
    const [currentDecision, setCurrentDecision] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (!initialData) {
            setSlug(slugify(newTitle, { lower: true, strict: true }));
        }
    };

    const addTech = () => {
        if (currentTech && !techStack.includes(currentTech)) {
            setTechStack([...techStack, currentTech]);
            setCurrentTech("");
        }
    };

    const addDecision = () => {
        if (currentDecision) {
            setKeyDecisions([...keyDecisions, currentDecision]);
            setCurrentDecision("");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append("file", file);

            try {
                const res = await fetch("/api/admin/upload", {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();
                if (data.success) {
                    setScreenshots((prev) => [...prev, { url: data.data.url, alt: title + " Screenshot" }]);
                }
            } catch (error) {
                console.error("Upload failed", error);
            }
        }
        setIsUploading(false);
    };

    const removeScreenshot = (index: number) => {
        setScreenshots(screenshots.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            title,
            slug,
            shortDescription,
            problem,
            solution,
            role,
            techStack,
            keyDecisions,
            screenshots,
            liveLink,
            githubLink,
            featured,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                <div>
                    <h2 className="text-3xl font-bold">{initialData ? "Edit Case Study" : "New Case Study"}</h2>
                    <p className="text-gray-500">Crafting the story of your project.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                    >
                        {isSubmitting ? "Saving..." : "Save Project"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* Main Info */}
                    <section className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 space-y-8">
                        <div className="space-y-4">
                            <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Project Identity</label>
                            <input
                                type="text"
                                placeholder="Project Title"
                                value={title}
                                onChange={handleTitleChange}
                                className="w-full text-4xl font-black bg-transparent border-none outline-none placeholder:text-gray-200 dark:placeholder:text-gray-800"
                                required
                            />
                            <div className="flex items-center gap-2 text-sm font-mono text-blue-500/50">
                                <span>/projects/</span>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="bg-transparent border-none outline-none text-blue-600 font-bold"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Brief Overview</label>
                            <textarea
                                placeholder="Hook the reader with a short summary..."
                                value={shortDescription}
                                onChange={(e) => setShortDescription(e.target.value)}
                                className="w-full p-6 bg-gray-50 dark:bg-gray-800/50 border-none rounded-3xl text-lg resize-none min-h-[120px]"
                                required
                            />
                        </div>
                    </section>

                    {/* Detailed Sections */}
                    <div className="grid grid-cols-1 gap-8">
                        <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-2"><Target className="text-red-500" /> The Problem</h3>
                            <textarea
                                value={problem}
                                onChange={(e) => setProblem(e.target.value)}
                                className="w-full p-6 bg-gray-50 dark:bg-gray-800/50 border-none rounded-3xl text-base min-h-[150px]"
                                placeholder="Describe the challenges faced..."
                                required
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-2"><Lightbulb className="text-amber-500" /> The Solution</h3>
                            <textarea
                                value={solution}
                                onChange={(e) => setSolution(e.target.value)}
                                className="w-full p-6 bg-gray-50 dark:bg-gray-800/50 border-none rounded-3xl text-base min-h-[150px]"
                                placeholder="Describe how you solved it..."
                                required
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-2"><User className="text-blue-500" /> Your Role</h3>
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full p-6 bg-gray-50 dark:bg-gray-800/50 border-none rounded-3xl text-base"
                                placeholder="e.g. Lead Full-Stack Developer"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Metadata & Links */}
                    <section className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 space-y-8">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Featured Project</label>
                            <button
                                type="button"
                                onClick={() => setFeatured(!featured)}
                                className={cn(
                                    "w-12 h-6 rounded-full transition-all relative",
                                    featured ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-800"
                                )}
                            >
                                <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", featured ? "right-1" : "left-1")} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <ExternalLink size={16} /> Live URL
                            </label>
                            <input
                                type="url"
                                value={liveLink}
                                onChange={(e) => setLiveLink(e.target.value)}
                                className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm"
                                placeholder="https://example.com"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <Github size={16} /> Repository URL
                            </label>
                            <input
                                type="url"
                                value={githubLink}
                                onChange={(e) => setGithubLink(e.target.value)}
                                className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm"
                                placeholder="https://github.com/..."
                            />
                        </div>
                    </section>

                    {/* Tech Stack */}
                    <section className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 space-y-6">
                        <h3 className="text-lg font-bold flex items-center gap-2"><Code className="text-purple-500" size={20} /> Tech Stack</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={currentTech}
                                onChange={(e) => setCurrentTech(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                                className="flex-grow p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm"
                                placeholder="Add tool..."
                            />
                            <button type="button" onClick={addTech} className="p-4 bg-blue-600 text-white rounded-2xl">+</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {techStack.map((tech) => (
                                <span key={tech} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold flex items-center gap-2">
                                    {tech}
                                    <button type="button" onClick={() => setTechStack(techStack.filter(t => t !== tech))}><X size={12} /></button>
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Key Decisions */}
                    <section className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 space-y-6">
                        <h3 className="text-lg font-bold flex items-center gap-2"><ListChecks className="text-green-500" size={20} /> Key Decisions</h3>
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={currentDecision}
                                    onChange={(e) => setCurrentDecision(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addDecision())}
                                    className="flex-grow p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm"
                                    placeholder="Add decision..."
                                />
                                <button type="button" onClick={addDecision} className="p-4 bg-blue-600 text-white rounded-2xl">+</button>
                            </div>
                            <div className="space-y-3">
                                {keyDecisions.map((decision, i) => (
                                    <div key={i} className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-black text-blue-500">{i + 1}.</span>
                                        <p className="flex-grow">{decision}</p>
                                        <button type="button" onClick={() => setKeyDecisions(keyDecisions.filter((_, idx) => idx !== i))}><Trash2 size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Screenshots */}
            <section className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 space-y-8">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                        <Monitor className="text-gray-400" />
                        Project Screenshots
                    </h3>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-6 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 text-gray-600 dark:text-gray-300 rounded-xl font-bold transition-all border border-gray-100 dark:border-gray-700"
                    >
                        <Upload size={18} /> Add Images
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" multiple />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {screenshots.map((s, i) => (
                        <div key={i} className="group relative aspect-video rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 dark:border-gray-800">
                            <img src={s.url} alt="" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeScreenshot(i)}
                                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={16} />
                            </button>
                            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                                <span className="text-[10px] text-white font-bold uppercase tracking-widest">{i === 0 ? "Hero Image" : `Screenshot ${i + 1}`}</span>
                            </div>
                        </div>
                    ))}
                    {isUploading && (
                        <div className="aspect-video rounded-3xl border-2 border-dashed border-blue-200 dark:border-blue-900/50 flex items-center justify-center animate-pulse bg-blue-50/10">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                    {screenshots.length === 0 && !isUploading && (
                        <div className="col-span-full py-20 text-center text-gray-400">
                            <ImageIcon className="mx-auto mb-4 opacity-20" size={48} />
                            <p>No screenshots uploaded yet. The first one is used as the hero image.</p>
                        </div>
                    )}
                </div>
            </section>
        </form>
    );
}
