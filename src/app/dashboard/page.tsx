"use client";

import useSWR from "swr";
import {
    Briefcase,
    FileEdit,
    Mail,
    ArrowUpRight,
    Clock,
    Plus,
    ChevronRight,
    Loader2,
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
    const { data, error, isLoading } = useSWR("/api/admin/stats", fetcher, {
        refreshInterval: 30000, // Refresh every 30 seconds
    });

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/10 rounded-2xl flex items-center justify-center text-red-500">
                    <AlertCircle size={32} />
                </div>
                <p className="text-gray-500 font-medium">Failed to load statistics</p>
                <button onClick={() => window.location.reload()} className="text-brand-red font-black uppercase tracking-widest text-xs hover:underline">
                    Try again
                </button>
            </div>
        );
    }

    const stats = data?.success ? data.data.counts : null;
    const activity = data?.success ? data.data.recentActivity : [];

    const statCards = [
        {
            label: "Total Projects",
            value: stats?.projects || 0,
            icon: Briefcase,
            color: "red",
            href: "/dashboard/projects"
        },
        {
            label: "Blog Posts",
            value: stats?.posts || 0,
            icon: FileEdit,
            color: "gold",
            href: "/dashboard/blog"
        },
        {
            label: "New Messages",
            value: stats?.unread || 0,
            icon: Mail,
            color: "red-subtle",
            href: "/dashboard/contact?processed=false",
            highlight: (stats?.unread || 0) > 0
        },
    ];

    return (
        <div className="space-y-12 pb-20">
            {/* Welcome Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight uppercase font-display">System <span className="text-brand-red">Overview</span></h1>
                    <p className="text-gray-500 mt-1">Here's what's happening with your portfolio today.</p>
                </div>

                <div className="flex gap-4">
                    <Link
                        href="/dashboard/projects/new"
                        className="flex items-center gap-2 px-6 py-3 bg-brand-red text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-red-hover transition-all shadow-xl shadow-brand-red/20"
                    >
                        <Plus size={18} /> New Project
                    </Link>
                    <Link
                        href="/dashboard/blog/new"
                        className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold hover:opacity-90 transition-all"
                    >
                        <Plus size={18} /> New Post
                    </Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-44 bg-white dark:bg-gray-900 rounded-[2.5rem] animate-pulse border border-gray-100 dark:border-gray-800" />
                    ))
                ) : (
                    statCards.map((stat, i) => (
                        <Link
                            key={i}
                            href={stat.href}
                            className="group bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden"
                        >
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors",
                                stat.color === "red" ? "bg-brand-red/10 text-brand-red" :
                                    stat.color === "gold" ? "bg-brand-gold/10 text-brand-gold" :
                                        "bg-brand-red/5 text-brand-red/60"
                            )}>
                                <stat.icon size={28} />
                            </div>

                            <div className="space-y-1">
                                <p className="text-gray-500 font-bold text-sm uppercase tracking-wider">{stat.label}</p>
                                <p className="text-4xl font-black">{stat.value}</p>
                            </div>

                            {stat.highlight && (
                                <div className="absolute top-6 right-6 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                            )}

                            <div className="absolute bottom-8 right-8 text-border group-hover:text-brand-red transition-colors">
                                <ArrowUpRight size={24} />
                            </div>
                        </Link>
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Recent Activity Feed */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black flex items-center gap-3 uppercase font-display tracking-tight">
                            <Clock className="text-brand-gold" />
                            Recent Activity
                        </h2>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                        {activity.length > 0 ? (
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {activity.map((item: any, i: number) => (
                                    <div key={i} className="p-8 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                                        <div className="flex items-center gap-6">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs uppercase",
                                                item.type === 'project' ? "bg-brand-red/10 text-brand-red" :
                                                    item.type === 'post' ? "bg-brand-gold/10 text-brand-gold" :
                                                        "bg-brand-red/5 text-brand-red/60"
                                            )}>
                                                {item.type.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-gray-100">{item.title}</p>
                                                <p className="text-sm text-gray-400">
                                                    {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            href={
                                                item.type === 'project' ? `/dashboard/projects/${item.id}/edit` :
                                                    item.type === 'post' ? `/dashboard/blog/${item.id}/edit` :
                                                        `/dashboard/contact`
                                            }
                                            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-bold text-xs flex items-center gap-2"
                                        >
                                            Manage <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <p className="text-gray-400 font-medium">No recent activity found.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Help / Info */}
                <div className="lg:col-span-4 space-y-8">
                    <h2 className="text-2xl font-black flex items-center gap-3 uppercase font-display tracking-tight">
                        <Plus className="text-brand-red" />
                        Quick Tips
                    </h2>

                    <div className="space-y-4">
                        {[
                            "Use the 'Featured' toggle to highlight projects on your home page.",
                            "Markdown supports GFM for professional blog formatting.",
                            "PDF CVs are served directly from Cloudinary for performance.",
                            "Check the Contact inbox daily for new professional inquiries."
                        ].map((tip, i) => (
                            <div key={i} className="p-6 bg-brand-red/5 rounded-[2rem] border border-brand-red/10 flex gap-4">
                                <div className="w-6 h-6 bg-brand-red text-white rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black">{i + 1}</div>
                                <p className="text-sm text-brand-red/80 dark:text-red-100/80 leading-relaxed font-medium">
                                    {tip}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
