import connectDB from "@/lib/db";
import Project from "@/models/Project";
import BlogPost from "@/models/BlogPost";
import ContactMessage from "@/models/ContactMessage";
import {
    FolderKanban,
    PenTool,
    Mail,
    ArrowUpRight,
    TrendingUp,
    Clock
} from "lucide-react";
import Link from "next/link";

async function getStats() {
    await connectDB();
    const [projectsCount, blogsCount, contactsCount] = await Promise.all([
        Project.countDocuments(),
        BlogPost.countDocuments(),
        ContactMessage.countDocuments({ status: "new" }),
    ]);

    return { projectsCount, blogsCount, contactsCount };
}

export default async function AdminDashboardPage() {
    const stats = await getStats();

    const cards = [
        { name: "Projects", value: stats.projectsCount, icon: FolderKanban, href: "/admin/projects", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
        { name: "Blog Posts", value: stats.blogsCount, icon: PenTool, href: "/admin/blog", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
        { name: "New Messages", value: stats.contactsCount, icon: Mail, href: "/admin/contact", color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
    ];

    return (
        <div className="space-y-12">
            <header>
                <h1 className="text-4xl font-bold tracking-tight mb-2 italic">Welcome back, Felipe.</h1>
                <p className="text-gray-500">Here's what's happening with your portfolio today.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {cards.map((card) => (
                    <Link
                        key={card.name}
                        href={card.href}
                        className="group p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div className={cn("p-4 rounded-2xl transition-colors", card.bg, card.color)}>
                                <card.icon size={24} />
                            </div>
                            <ArrowUpRight className="text-gray-300 group-hover:text-blue-500 transition-colors" size={24} />
                        </div>
                        <div>
                            <div className="text-4xl font-black mb-1 tracking-tighter">{card.value}</div>
                            <div className="text-gray-400 font-semibold text-sm uppercase tracking-widest">{card.name}</div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions or Analytics placeholder */}
                <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-600" />
                        Performance Overview
                    </h3>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
                        <span className="text-gray-400 text-sm">Analytics integration coming soon...</span>
                    </div>
                </div>

                <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Clock size={20} className="text-amber-600" />
                        Quick Draft
                    </h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Post title..."
                            className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm"
                        />
                        <textarea
                            placeholder="What's on your mind?"
                            className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm min-h-[120px] resize-none"
                        ></textarea>
                        <button className="w-full py-4 bg-gray-900 dark:bg-blue-600 text-white rounded-2xl font-bold hover:opacity-90 transition-opacity">
                            Save Quick Draft
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { cn } from "@/lib/utils";
