import connectDB from "@/lib/db";
import Project from "@/models/Project";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Eye, Star } from "lucide-react";

async function getProjects() {
    await connectDB();
    return await Project.find({}).sort({ createdAt: -1 }).lean();
}

export default async function AdminProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects Showcase</h1>
                    <p className="text-gray-500">Manage your portfolio projects and case studies.</p>
                </div>
                <Link
                    href="/admin/projects/new"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20"
                >
                    <Plus size={20} />
                    Add Project
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter by title or technology..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50 dark:border-gray-800">
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Project</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Tech Stack</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {projects.map((project: any) => (
                                <tr key={project._id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-5">
                                            {project.screenshots?.[0] ? (
                                                <div className="w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-800">
                                                    <img src={project.screenshots[0].url} className="w-full h-full object-cover" alt="" />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-300">
                                                    <Eye size={20} />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{project.title}</div>
                                                <div className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">/{project.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {project.featured ? (
                                            <span className="flex items-center gap-1.5 text-amber-500 font-bold text-[10px] uppercase tracking-widest">
                                                <Star size={12} fill="currentColor" /> Featured
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Normal</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                                            {project.techStack.slice(0, 3).map((tech: string) => (
                                                <span key={tech} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-md text-[9px] font-bold uppercase">
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.techStack.length > 3 && (
                                                <span className="text-[9px] text-gray-400 font-bold">+{project.techStack.length - 3}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Link
                                                href={`/projects/${project.slug}`}
                                                target="_blank"
                                                className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link
                                                href={`/admin/projects/${project.slug}/edit`}
                                                className="p-3 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-2xl transition-all"
                                            >
                                                <Edit2 size={18} />
                                            </Link>
                                            <button className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {projects.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-32 text-center">
                                        <div className="max-w-xs mx-auto space-y-4">
                                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto">
                                                <Plus className="text-gray-300" size={32} />
                                            </div>
                                            <p className="text-gray-500 font-medium">No projects showcase created yet.</p>
                                            <Link href="/admin/projects/new" className="text-blue-600 font-bold text-sm">Add your first project</Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
