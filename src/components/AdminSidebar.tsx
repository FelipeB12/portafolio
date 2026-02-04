"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
    LayoutDashboard,
    Briefcase,
    FileEdit,
    FileText,
    Mail,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    User,
    ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { id: "projects", label: "Projects", icon: Briefcase, href: "/dashboard/projects" },
    { id: "blog", label: "Blog Posts", icon: FileEdit, href: "/dashboard/blog" },
    { id: "cv", label: "Curriculum", icon: FileText, href: "/dashboard/cv" },
    { id: "contact", label: "Messages", icon: Mail, href: "/dashboard/contact" },
    { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <aside
            className={cn(
                "h-screen fixed left-0 top-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300 flex flex-col z-50",
                isCollapsed ? "w-24" : "w-72"
            )}
        >
            {/* Header */}
            <div className="p-8 flex items-center justify-between">
                <div className={cn("flex items-center gap-3", isCollapsed && "hidden")}>
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="text-white font-black text-xl">A</span>
                    </div>
                    <span className="font-black text-xl tracking-tight">Admin<span className="text-blue-600">.</span></span>
                </div>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-grow px-4 space-y-2 py-4 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all relative group",
                                isActive
                                    ? "bg-blue-50 dark:bg-blue-900/10 text-blue-600"
                                    : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100"
                            )}
                        >
                            <item.icon size={22} className={cn("transition-transform group-hover:scale-110", isActive && "text-blue-600")} />
                            <span className={cn("transition-all duration-300", isCollapsed ? "opacity-0 invisible w-0" : "opacity-100 visible")}>
                                {item.label}
                            </span>

                            {isActive && !isCollapsed && (
                                <div className="absolute left-0 w-1.5 h-6 bg-blue-600 rounded-r-full" />
                            )}

                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[60]">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 mt-auto border-t border-gray-100 dark:border-gray-800">
                <div className={cn(
                    "bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl space-y-4 transition-all",
                    isCollapsed && "p-2 items-center flex flex-col"
                )}>
                    {!isCollapsed && (
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                                <User size={20} />
                            </div>
                            <div className="flex-grow min-w-0">
                                <p className="font-bold text-sm truncate">{session?.user?.name || "Admin"}</p>
                                <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => signOut()}
                        className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-2xl text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-all",
                            isCollapsed && "justify-center"
                        )}
                    >
                        <LogOut size={20} />
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </div>

                {!isCollapsed && (
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400 font-bold hover:text-blue-600 transition-colors"
                    >
                        Visit Website <ExternalLink size={12} />
                    </Link>
                )}
            </div>
        </aside>
    );
}
