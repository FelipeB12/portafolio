"use client";

import useSWR from "swr";
import Link from "next/link";
import { Plus, Search, Edit2, Eye, Trash2, Loader2, Briefcase } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardProjectsPage() {
    const { data, error, isLoading, mutate } = useSWR("/api/admin/projects", fetcher);
    const [search, setSearch] = useState("");

    const projects = data?.success ? (Array.isArray(data.data) ? data.data : data.data.projects) || [] : [];

    const filteredProjects = projects.filter((p: any) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (slug: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            const res = await fetch(`/api/admin/projects/${slug}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Project deleted successfully");
                mutate();
            } else {
                toast.error(data.error || "Delete failed");
            }
        } catch (err) {
            toast.error("An error occurred");
        }
    };

    return (
        <div className="space-y-12 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Projects <span className="text-blue-600">Store</span></h1>
                    <p className="text-gray-500 mt-1">Manage your professional case studies and showcases.</p>
                </div>

                <Link
                    href="/dashboard/projects/new"
                    className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                >
                    <Plus size={20} /> Add Project
                </Link>
            </header>

            <div className="space-y-8">
                <div className="relative max-w-md">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search projects by title or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-16 pr-8 py-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="py-40 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="animate-spin text-blue-600" size={40} />
                            <p className="text-gray-400 font-bold">Loading your portfolio...</p>
                        </div>
                    ) : filteredProjects.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-800/10">
                                        <th className="p-8 text-xs font-black uppercase tracking-widest text-gray-400">Project</th>
                                        <th className="p-8 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                                        <th className="p-8 text-xs font-black uppercase tracking-widest text-gray-400">Created</th>
                                        <th className="p-8 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {filteredProjects.map((project: any) => (
                                        <tr key={project._id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-all">
                                            <td className="p-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-20 aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
                                                        {project.screenshots?.[0] && (
                                                            <img src={project.screenshots[0].url} alt="" className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-black text-lg line-clamp-1">{project.title}</p>
                                                        <p className="text-sm text-gray-400 line-clamp-1">{project.shortDescription}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                {project.featured ? (
                                                    <span className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-tighter">Featured</span>
                                                ) : (
                                                    <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-full text-xs font-bold uppercase tracking-tighter">Standard</span>
                                                )}
                                            </td>
                                            <td className="p-8 text-sm text-gray-500 font-medium">
                                                {new Date(project.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-8">
                                                <div className="flex justify-end gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                                                    <Link
                                                        href={`/projects/${project.slug}`}
                                                        target="_blank"
                                                        className="p-3 bg-white dark:bg-gray-800 text-gray-400 hover:text-blue-600 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
                                                    >
                                                        <Eye size={18} />
                                                    </Link>
                                                    <Link
                                                        href={`/dashboard/projects/${project.slug}/edit`}
                                                        className="p-3 bg-white dark:bg-gray-800 text-gray-400 hover:text-amber-500 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
                                                    >
                                                        <Edit2 size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(project.slug)}
                                                        className="p-3 bg-white dark:bg-gray-800 text-gray-400 hover:text-red-500 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-40 text-center space-y-6">
                            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                                <Briefcase className="text-gray-200" size={40} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-xl font-black">No projects found</p>
                                <p className="text-gray-400">Start by creating your first showcase item.</p>
                            </div>
                            <Link
                                href="/dashboard/projects/new"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold hover:opacity-90 transition-all"
                            >
                                <Plus size={18} /> Create Project
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
